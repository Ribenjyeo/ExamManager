using System.ComponentModel.DataAnnotations;

namespace ExamManager.Models
{
    public class LoginEditModel
    {
        [Required(ErrorMessage = "Необходимо ввести логин")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Необходимо ввести пароль")]
        public string Password { get; set; }
    }
}
