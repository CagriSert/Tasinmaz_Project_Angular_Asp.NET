using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Tasinmaz.Models
{
    public class Ilce
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("IlId")]
        public virtual Il Il{ get; set; }
        public int IlId { get; set; }

        public string IlceName{ get; set; }
    }
}
