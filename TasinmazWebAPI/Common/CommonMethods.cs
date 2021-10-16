using System;
using System.Text;

namespace TasinmazWebAPI.Common
{
    public class CommonMethods
    {
        public static string Key ="01234567890123456";

        public static string ConvertToEncrypt(string password){
            if(string.IsNullOrEmpty(password)) return "";
            password +=Key;
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            return Convert.ToBase64String(passwordBytes);
        }
        public static string ConvertToDecrypt(string base64EncodeData){
            if(string.IsNullOrEmpty(base64EncodeData)) return "";
            var base64EncodeBytes = Convert.FromBase64String(base64EncodeData);
            var result = Encoding.UTF8.GetString(base64EncodeBytes);
            result = result.Substring(0,result.Length - Key.Length);
            return result;
            
        }
        
        
    }
}