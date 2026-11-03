using System.Collections.Generic;

namespace Zhuandown.Core.Models
{
    public class ContentState
    {
        public WordCount WordCount { get; set; }

        public List<TocItem> Toc { get; set; }

        public TocItem Cur { get; set; }
    }
}
