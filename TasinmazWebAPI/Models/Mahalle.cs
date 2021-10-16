using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Tasinmaz.Models
{
    public class Mahalle
    {
        [Key]
        public int MahalleId { get; set; }

        [ForeignKey("IlceId")]
        public virtual Ilce Ilce { get; set; }
        public int IlceId { get; set; }

        public string MahalleName { get; set; }
    }
}
