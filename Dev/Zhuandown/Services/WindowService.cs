using System.Reactive.Subjects;
using Zhuandown.Core.Interfaces;
using Zhuandown.Core.Utilities;
using Typedown.XamlUI;
using Windows.Foundation;
using Windows.UI.Xaml;

namespace Zhuandown.Services
{
    public class WindowService : IWindowService
    {
        public Subject<nint> WindowStateChanged { get; } = new();

        public Subject<nint> WindowIsActivedChanged { get; } = new();

        public void RaiseWindowStateChanged(nint hWnd) => WindowStateChanged.OnNext(hWnd);

        public void RaiseWindowIsActivedChanged(nint hWnd) => WindowIsActivedChanged.OnNext(hWnd);

        public nint GetWindow(UIElement element) => XamlWindow.GetWindow(element)?.Handle ?? default;

        public nint GetXamlSourceHandle(UIElement element) => XamlWindow.GetWindow(element)?.XamlSourceHandle ?? default;

        public Point GetCursorPos(UIElement relativeTo)
        {
            var window = XamlWindow.GetWindow(relativeTo);
            PInvoke.GetCursorPos(out var screenPos);
            PInvoke.GetWindowRect(window.XamlSourceHandle, out var xamlRootRect);
            var pos = new Point((screenPos.X - xamlRootRect.left) / window.ScalingFactor, (screenPos.Y - xamlRootRect.top) / window.ScalingFactor);
            return relativeTo.XamlRoot.Content.TransformToVisual(relativeTo).TransformPoint(pos);
        }
    }
}
