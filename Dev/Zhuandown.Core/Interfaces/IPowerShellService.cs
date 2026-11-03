using System.Collections.Generic;

namespace Zhuandown.Core.Interfaces
{
    public interface IPowerShellService
    {
        IEnumerable<string> Invoke(string script, string command, params string[] parameters);
    }
}
