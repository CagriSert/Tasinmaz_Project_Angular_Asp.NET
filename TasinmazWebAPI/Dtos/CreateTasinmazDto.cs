using GeoAPI.Geometries;

namespace TasinmazWebAPI.Dtos
{
    public class CreateTasinmazDto
    {
        public int IlId { get; set; }
        public int IlceId { get; set; }
        public int MahalleId { get; set; }
        public int Parsel { get; set; }
        public int Ada { get; set; }
        public string Nitelik { get; set; }
        public string XCoordinate { get; set; }
        public string YCoordinate { get; set; }
        
        // public IPoint Coordinates { get; set; }

    }
}