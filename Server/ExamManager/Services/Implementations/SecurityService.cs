using System.Security.Cryptography;
using System.Text;

namespace ExamManager.Services
{
    public class SecurityService : ISecurityService
    {
        public string Encrypt(string source)
        {
            string? hash = null;
            using (SHA512 sha512Hash = SHA512.Create())
            {
                byte[] sourceBytes = Encoding.UTF8.GetBytes(source);
                byte[] hashBytes = sha512Hash.ComputeHash(sourceBytes);
                hash = BitConverter.ToString(hashBytes).Replace("-", String.Empty);
            }

            return hash;
        }

        public bool ValidatePassword(string password, string hash)
        {
            return hash.Equals(Encrypt(password));
        }
    }
}
