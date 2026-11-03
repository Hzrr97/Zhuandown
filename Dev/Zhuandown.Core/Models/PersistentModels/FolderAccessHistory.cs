using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Zhuandown.Core.Models
{
    [Table("FolderAccessHistory")]
    public class FolderAccessHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime AccessTime { get; set; }

        public string FolderPath { get; set; }
    }
}
