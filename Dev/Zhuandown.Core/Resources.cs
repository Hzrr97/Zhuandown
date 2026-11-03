using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;

namespace Zhuandown.Core
{
    public class Resources : ResourceDictionary
    {
        public Resources()
        {
            MergedDictionaries.Add(new Microsoft.UI.Xaml.Controls.XamlControlsResources());
            MergedDictionaries.Add(new() { Source = new("ms-appx:///Zhuandown.Core/Resources/Styles/Button.xaml") });
            MergedDictionaries.Add(new() { Source = new("ms-appx:///Zhuandown.Core/Resources/Styles/ComboBox.xaml") });
            MergedDictionaries.Add(new() { Source = new("ms-appx:///Zhuandown.Core/Resources/Styles/ContentDialog.xaml") });
            MergedDictionaries.Add(new() { Source = new("ms-appx:///Zhuandown.Core/Resources/Styles/ToggleSwitch.xaml") });
            MergedDictionaries.Add(new() { Source = new("ms-appx:///Zhuandown.Core/Resources/Converters.xaml") });
        }
    }
}
