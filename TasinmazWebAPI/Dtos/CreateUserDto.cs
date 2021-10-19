using System.ComponentModel.DataAnnotations.Schema;
using Tasinmaz.Models;

namespace Tasinmaz.Dtos
{
    public class CreateUserDto
    {
        public int RolId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Mail { get; set; }
        
    }
}