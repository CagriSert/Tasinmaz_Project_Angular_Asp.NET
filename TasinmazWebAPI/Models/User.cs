using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Tasinmaz.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("Rols")]
        public int RolId { get; set; }
        public Rol Rol{ get; set; }
        
        
        public string Name { get; set; }
        public string LastName{ get; set; }
        public string Mail { get; set; }
        public string Password { get; set; }
        public byte[] PasswordSalt { get; set; }
        public byte[] PasswordHash { get; set; }
        
        
    }
}
