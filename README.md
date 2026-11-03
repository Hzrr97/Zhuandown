<p align="center">
  <img alt="Zhuandown Logo" src="./logo.png" width="100px" />
  <h1 align="center">Zhuandown</h1>
</p>

Zhuandown 是基于 [Typedown](https://github.com/byxiaozhi/Typedown) 开发的 Windows Markdown 编辑器，提供可视化编辑、源码编辑和文档导出功能。本项目升级 Mermaid 图表渲染，支持新版语法，并处理异步预览、主题切换及导出时的图表渲染。

当前 Mermaid 依赖固定为 **12.2.0**。图表库随应用打包，常规图表渲染无需连接 CDN；需要额外插件、外部图标或网络资源的用法不包含在默认支持范围内。运行时需要支持新版 JavaScript 的 WebView2 Runtime，建议安装当前稳定版本。

## 项目来源

本项目的工程、程序集、应用显示名称及独立配置目录统一使用 `Zhuandown`。第三方依赖 `Typedown.XamlUI` 保留原有包名与命名空间。应用图标使用仓库中的 Zhuandown Logo，下列截图仍沿用上游资源。

项目遵循 [MIT License](./LICENSE)，保留原作者版权声明。感谢 Typedown 及其依赖项目的贡献者。

## 界面截图

以下为上游 Typedown 的界面截图，供了解编辑器布局：

<figure>
<img src="https://github.com/byxiaozhi/Typedown/assets/31278216/d0c9d76b-ecd2-4941-90ca-0f8c639c2ef0" width="200" />
<img src="https://github.com/byxiaozhi/Typedown/assets/31278216/d5320590-2d0b-4f9a-a3d2-4661eb021758" width="200" />
<img src="https://github.com/byxiaozhi/Typedown/assets/31278216/2ce7795c-1043-41ed-a420-c42f7aa5aa80" width="200" />
<img src="https://github.com/byxiaozhi/Typedown/assets/31278216/a2df17f3-3100-4129-b0ba-0e90e14a89bf" width="200" />
</figure>

## 从源码构建

### 1. 环境准备

- Windows 和 [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)，安装项目所需的桌面开发、UWP 开发组件及 Windows SDK。工程使用 Windows SDK 10.0.22000.0，具体依赖以工程文件为准。
- 能够构建 `netcoreapp3.1` 的 .NET SDK。本次自包含发布使用 .NET SDK 9.0.320 和 Visual Studio Build Tools 2022，桌面主工程目标框架仍为 `netcoreapp3.1`。
- [Git for Windows](https://git-scm.com/download/win)。
- [Node.js](https://nodejs.org/) 22.12.0 或以上，以及 Yarn Classic 1.22.22。本次前端验证环境为 Node.js 24.15.0、Yarn 1.22.22。
- Microsoft Edge WebView2 Runtime。

### 2. 获取代码

```powershell
git clone https://github.com/Hzrr97/Zhuandown.git
cd Zhuandown
```

### 3. 构建前端

在仓库根目录执行：

```powershell
cd Dev\Zhuandown.Editor
yarn install --frozen-lockfile
yarn build
```

构建产物输出到 `Dev\Zhuandown\Resources\Statics`。

运行异步渲染回归测试：

```powershell
yarn test --watchAll=false --runInBand
```

### 4. 构建桌面应用

使用 Visual Studio 2022 打开仓库根目录的 `Zhuandown.sln`，将 `Zhuandown` 设为启动项目，恢复 NuGet 依赖并选择配置：

- `Debug`：编辑器访问 `http://localhost:3000`，需要在 `Dev\Zhuandown.Editor` 中额外运行 `yarn start`。
- `Debug_Local`：编辑器加载已构建的本地静态资源，运行前先完成前端构建。
- `Release`：用于发布构建，同样需要先构建前端资源。

桌面主工程声明的平台为 `x64` 和 `x86`，请选择匹配的平台构建运行。桌面端仍依赖原工程的 SDK、NuGet 配置及构建组件；前端构建成功不代表桌面端构建已经通过。

### 5. 发布 x64 自包含程序

准备好构建环境和前端依赖后，在仓库根目录执行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Tools\Publish-SelfContained.ps1
```

脚本使用 Visual Studio 或 Build Tools 的 MSBuild，重新构建前端，再通过 `WinX64SelfContained` 配置发布桌面主工程，并生成：

- `artifacts\Zhuandown-win-x64\`：包含 `Zhuandown.exe`、.NET 运行时、原生依赖和编辑器资源的完整发布目录。
- `artifacts\Zhuandown-win-x64.zip`：可分发的压缩包，解压后运行其中的 `Zhuandown.exe`。

发布配置关闭裁剪，采用文件夹形式。请分发完整目录；用户无需另装 .NET 运行时，仍需 WebView2 Runtime，应用启动时会检测缺失情况。

脚本统一为主工程及 Core 工程指定 Windows SDK `10.0.22000.0`，并使用 x64 MSBuild。Zhuandown 使用独立的单实例标识、进程通信管道和 `文档\Zhuandown` 配置目录，可以与原版 Typedown 分别运行；已有 Typedown 配置和文档不会被自动迁移或删除。发布验证详情见[自包含发布记录](./doc/v0.0.1/自包含发布记录.md)。

## 反馈与贡献

欢迎通过本仓库的 [Issues](https://github.com/Hzrr97/Zhuandown/issues) 反馈问题，或提交 [Pull Request](https://github.com/Hzrr97/Zhuandown/pulls)。反馈 Mermaid 显示问题时，请附上可复现的 Mermaid 代码、主题及发生问题的场景（预览、HTML、PDF 或打印）。
