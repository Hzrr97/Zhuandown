using System;
using System.Runtime.InteropServices;

namespace Zhuandown.Core.Interfaces
{
    [ComImport, Guid("06636C29-5A17-458D-8EA2-2422D997A922"), InterfaceType(ComInterfaceType.InterfaceIsIInspectable)]
    public interface IWindowPrivate
    {
        bool TransparentBackground { get; set; }
    }
}
