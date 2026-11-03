using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Zhuandown.Core.Enums;
using Zhuandown.Core.Models;

namespace Zhuandown.Core.Interfaces
{
    public interface IFileExport
    {
        ObservableCollection<ExportConfig> ExportConfigs { get; }

        Task<ExportConfig> AddExportConfig(string name = null, ExportType type = 0);

        Task RemoveExportConfig(int id);

        Task<bool> SaveExportConfig(ExportConfig config);

        Task<ExportConfig> GetExportConfig(int id);

        Task UpdateExportConfigs();

        Task Print(string basePath, string html, string documentName = null);
    }
}
