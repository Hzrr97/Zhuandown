using System;
using Zhuandown.Core.Models;
using Zhuandown.Core.Utilities;
using Windows.UI.Xaml.Data;

namespace Zhuandown.Core.Converters
{
    public class ShortcutKeyToStringConverter: IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            return value is ShortcutKey key ? Common.GetShortcutKeyText(key) : null;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
