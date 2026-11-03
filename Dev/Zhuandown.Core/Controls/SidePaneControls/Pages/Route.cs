using System;
using Zhuandown.Core.Controls.SidePanelControls.Pages;

namespace Zhuandown.Core.Controls.SidePaneControls.Pages
{
    public static class Route
    {
        public static Type GetSidePanePageType(string name) => name switch
        {
            "Toc" => typeof(TocPage),
            "Folder" => typeof(FolderPage),
            _ => null
        };
    }
}
