using System.Linq;

namespace Zhuandown.Core.Utilities
{
    public static class CommandLine
    {
        public static string GetOpenFilePath(string[] commandLineArgs)
        {
            return commandLineArgs?.Where(FileTypeHelper.IsMarkdownFile).FirstOrDefault();
        }
    }
}
