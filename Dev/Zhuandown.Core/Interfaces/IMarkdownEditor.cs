using System;
using System.ComponentModel;
using Windows.Foundation;
using Windows.UI.Xaml.Shapes;

namespace Zhuandown.Core.Interfaces
{
    public interface IMarkdownEditor : IDisposable, INotifyPropertyChanged
    {
        bool PostMessage(string name, object arg);

        Rectangle GetDummyRectangle(Rect rect);

        Rectangle MoveDummyRectangle(Point offset);

        bool IsEditorLoadFailed { get; }

        bool IsEditorLoaded { get; }
    }
}
