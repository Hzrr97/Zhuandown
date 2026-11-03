using System.IO;
using System.Threading.Tasks;
using Zhuandown.Core.Models;

namespace Zhuandown.Core.Interfaces
{
    public interface IFileConverter
    {
        Task<MemoryStream> HtmlToPdf(string html, PdfPrintSettings settings = null);
    }
}
