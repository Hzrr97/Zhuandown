using System;
using System.Collections.Generic;
using System.Linq;
using Zhuandown.Core.Utilities;

namespace Zhuandown.Core.Enums
{
    public enum AppTheme
    {
        [Locale("UseSystemSetting")]
        Default = 0,

        [Locale("View.AppTheme.Light")]
        Light = 1,

        [Locale("View.AppTheme.Dark")]
        Dark = 2,
    }

    public static partial class Enumerable
    {
        public static IReadOnlyList<AppTheme> AppThemes { get; } = Enum.GetValues(typeof(AppTheme)).Cast<AppTheme>().ToList();
    }
}
