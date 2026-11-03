using static Zhuandown.Core.Models.CursorState;

namespace Zhuandown.Core.Models
{
    public record CursorState(Pos Anchor, Pos Focus)
    {
        public record Pos(int Line, int Ch);
    }
}
