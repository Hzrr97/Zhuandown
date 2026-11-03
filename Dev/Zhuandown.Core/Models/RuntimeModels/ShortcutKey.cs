using Windows.System;

namespace Zhuandown.Core.Models
{
    public record ShortcutKey(VirtualKeyModifiers Modifiers, VirtualKey Key)
    {
        public override string ToString()
        {
            return base.ToString();
        }
    }
}
