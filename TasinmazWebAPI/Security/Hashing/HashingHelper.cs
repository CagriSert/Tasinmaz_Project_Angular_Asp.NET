using System.Text;
namespace TasinmazWebAPI.Security.Hashing
{
    public class HashingHelper
    {
        public static void CreatePasswordHash(string password,
        out byte[] passwordHash, out byte[] passwordSalt){
            using(var hmac = new System.Security.Cryptography.HMACSHA256())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
        public static bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA256(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (var i = 0; i < computedHash.Length; i++)
                {
                    if(computedHash[i]!=passwordHash[i])
                    {
                        return false;
                    }                   
                }
            }
            return true;
        }
    }
}