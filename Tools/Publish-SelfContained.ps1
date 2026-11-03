$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$editorDirectory = Join-Path $repositoryRoot 'Dev\Zhuandown.Editor'
$projectPath = Join-Path $repositoryRoot 'Dev\Zhuandown\Zhuandown.csproj'
$publishDirectory = Join-Path $repositoryRoot 'artifacts\Zhuandown-win-x64'
$archivePath = Join-Path $repositoryRoot 'artifacts\Zhuandown-win-x64.zip'
$vswherePath = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'

# 让尚未重新打开的终端也能找到刚安装的 x64 SDK。
$dotnetDirectory = Join-Path $env:ProgramFiles 'dotnet'
if (Test-Path -LiteralPath (Join-Path $dotnetDirectory 'dotnet.exe')) {
    $env:DOTNET_ROOT = $dotnetDirectory
    $env:PATH = "$dotnetDirectory;$env:PATH"
}

if (-not (Test-Path -LiteralPath $vswherePath)) {
    throw '未找到 Visual Studio Installer，请先安装 .NET 桌面、UWP 构建工具及 Windows SDK。'
}

$msbuildPath = & $vswherePath -latest -products '*' -requires Microsoft.Component.MSBuild -find 'MSBuild\Current\Bin\amd64\MSBuild.exe'
$msbuildPath = $msbuildPath | Select-Object -First 1
if (-not $msbuildPath) {
    throw '未找到 MSBuild，请检查 Visual Studio 或 Build Tools 安装。'
}

$yarnPath = (Get-Command yarn.cmd -ErrorAction Stop).Source
Push-Location $editorDirectory
try {
    & $yarnPath build
    if ($LASTEXITCODE -ne 0) {
        throw "前端构建失败，退出码：$LASTEXITCODE"
    }
} finally {
    Pop-Location
}

# 每次发布使用干净目录，避免更名前的程序和程序集混入新包。
$artifactsRoot = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot 'artifacts')).TrimEnd('\') + '\'
$resolvedPublishDirectory = [System.IO.Path]::GetFullPath($publishDirectory)
if (-not $resolvedPublishDirectory.StartsWith($artifactsRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw '发布目录不在 artifacts 范围内，停止清理。'
}
if (Test-Path -LiteralPath $resolvedPublishDirectory) {
    $runningApplication = Get-CimInstance Win32_Process -Property ProcessId,ExecutablePath | Where-Object {
        $_.ExecutablePath -and $_.ExecutablePath.StartsWith($resolvedPublishDirectory + '\', [System.StringComparison]::OrdinalIgnoreCase)
    }
    if ($runningApplication) {
        throw '发布目录中的应用正在运行，请先保存文档并退出后再发布。'
    }
    Remove-Item -LiteralPath $resolvedPublishDirectory -Recurse -Force
}

# 仅发布桌面主工程，沿用仓库本地包，并补充官方 NuGet 源。
& $msbuildPath $projectPath /restore /t:Publish /p:Configuration=Release /p:Platform=x64 /p:TargetPlatformVersion=10.0.22000.0 /p:PublishProfile=WinX64SelfContained /p:RestoreAdditionalProjectSources=https://api.nuget.org/v3/index.json /verbosity:minimal /nologo
if ($LASTEXITCODE -ne 0) {
    throw "桌面发布失败，退出码：$LASTEXITCODE"
}

foreach ($requiredFile in @('Zhuandown.exe', 'Zhuandown.runtimeconfig.json', 'coreclr.dll', 'Resources\Statics\index.html')) {
    if (-not (Test-Path -LiteralPath (Join-Path $publishDirectory $requiredFile))) {
        throw "发布目录缺少必需文件：$requiredFile"
    }
}

Copy-Item -LiteralPath (Join-Path $repositoryRoot 'LICENSE') -Destination (Join-Path $publishDirectory 'LICENSE') -Force
Compress-Archive -Path (Join-Path $publishDirectory '*') -DestinationPath $archivePath -Force
Write-Output "自包含发布目录：$publishDirectory"
Write-Output "自包含发布压缩包：$archivePath"
