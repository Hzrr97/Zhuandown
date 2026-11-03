using System.Threading.Tasks;

namespace Zhuandown.Core.Utilities
{
    public static class Log
    {
        public static Task Report(string type, string content)
        {
            // Zhuandown 尚未配置远程上报服务，避免向原项目发送错误信息。
            return Task.CompletedTask;
        }
    }
}
