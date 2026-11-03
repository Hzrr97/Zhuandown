using Zhuandown.Core.Utilities;
using Zhuandown.Core.ViewModels;
using Windows.UI.Xaml.Controls;

namespace Zhuandown.Core.Pages
{
    public sealed partial class MainPage : Page
    {
        public AppViewModel AppViewModel => this.GetService<AppViewModel>();

        public MainPage()
        {
            InitializeComponent();
        }

        private void OnUnloaded(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
             Bindings?.StopTracking();
        }
    }
}
