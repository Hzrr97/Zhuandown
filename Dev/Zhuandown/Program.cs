using System;
using System.Threading.Tasks;
using Zhuandown.Core.Controls;
using Zhuandown.Core.Utilities;

namespace System.Runtime.CompilerServices
{
    public static class IsExternalInit { }
}

namespace Zhuandown
{
    public class Program
    {
        [STAThread]
        public static void Main()
        {
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
            App.Launch();
        }

        private static void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            if (e.IsTerminating)
            {
                Log.Report("UnhandledException", e.ExceptionObject.ToString()).Wait();
            }
        }
    }
}
