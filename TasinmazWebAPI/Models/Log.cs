using System.Net;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Tasinmaz.Models;

namespace TasinmazWebAPI.Models
{
    public class Log
    {
        public int Id { get; set; }
        public int UserId { get; set; }     
        public string Durum { get; set; }
        public string IslemTipi { get; set; }
        public string Aciklama { get; set; }
        public string DateTime { get; set; }
        public string UserIp { get; set; }
               
    }
}