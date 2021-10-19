using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GeoAPI.Geometries;
using Tasinmaz.Models;

namespace TasinmazWebAPI.Models
{
    public class TasinmazRegister
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Ils")]
        public int IlId { get; set; }
        public Il Il{ get; set; }
        

        [ForeignKey("Ilces")]
        public int IlceId { get; set; }
        public Ilce Ilce{ get; set; }

       
        [ForeignKey("Mahalles")]
        public int MahalleId { get; set; }
        public Mahalle Mahalle{ get; set; }

        public int Parsel { get; set; }
        public int Ada { get; set; }
        public string Nitelik { get; set; }
        public string XCoordinate { get; set; }
        public string YCoordinate { get; set; }
        // public IPoint Coordinates { get; set; }
    }
}