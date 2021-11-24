using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tasinmaz.Models
{
    public class KadastroParselModel
    {
        public int ZeminRef { get; set; }

        public long KimlikNo { get; set; }

        public string AdaNo { get; set; }

        public string ParselNo { get; set; }

        public string Cins { get; set; }

        public long CinsId { get; set; }

        public decimal TapuAlan { get; set; }

        public decimal KadastroAlan { get; set; }

        public int Tip { get; set; }

        public int BelirtmeTip { get; set; }

        /// <summary>
        /// 2: Pasif
        /// 3: Aktif
        /// </summary>
        public int Durum { get; set; }

        /// <summary>
        /// 0: Bilinmiyor
        /// 1: KMKuruldu
        /// 2: KMKurulmadi
        /// </summary>
        public int KatMulkiyetiDurum { get; set; }

        /// <summary>
        /// 0: Bilinmiyor
        /// 1: HazineParsel
        /// 2: HazineParselHisseli
        /// 3: HazineParselDegil
        /// </summary>
        public int HazineParselDurum { get; set; }

        public int OnayDurum { get; set; }

        public DateTime? KayitTarihi { get; set; }

        public DateTime? GuncellemeTarihi { get; set; }

        public string GeomWkt { get; set; }

        /// <summary>
        /// İlin veritabanındaki id değeri
        /// </summary>
        public int IlPkId { get; set; }

        /// <summary>
        /// İlin tapu id değeri
        /// </summary>
        public int IlTakbisId { get; set; }

        public string IlAd { get; set; }

        /// <summary>
        /// İlçenin veritabanındaki id değeri
        /// </summary>
        public int IlcePkId { get; set; }

        /// <summary>
        /// İlçenin takbis id değeri
        /// </summary>
        public int IlceTakbisId { get; set; }

        public string IlceAd { get; set; }

        /// <summary>
        /// Mahallenin veritabanındaki id değeri
        /// </summary>
        public int MahallePkId { get; set; }

        /// <summary>
        /// Mahallenin takbis id değeri
        /// </summary>
        public int MahalleTakbisId { get; set; }

        public string MahalleAd { get; set; }

        public decimal KoordinatX { get; set; }

        public decimal KoordinatY { get; set; }
    }
}
