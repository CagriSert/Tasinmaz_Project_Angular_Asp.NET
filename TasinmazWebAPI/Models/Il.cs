using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tasinmaz.Models
{
    public class Il
    {
        [Key]
        public int Id { get; set; }

        public string IlName{ get; set; }
    }
}