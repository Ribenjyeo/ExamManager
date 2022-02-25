namespace ExamManager.Services
{
    public interface ISecurityService
    {
        // Получить хэш-сумму пароля
        public string Encrypt(string source);

        // Соответствие пароля хэш-сумме
        public bool ValidatePassword(string password, string hash);
    }
}
