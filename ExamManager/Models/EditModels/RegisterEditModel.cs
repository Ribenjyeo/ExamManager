using System.ComponentModel.DataAnnotations;
using static ExamManager.Services.EntityManager;

namespace ExamManager.Models;

public record RegisterEditModel
{
    [Required(ErrorMessage = "Введите логин")]
    public string Login { get; set; }

    [Required(ErrorMessage = "Введите пароль")]
    [MapPropertyName(ForClass = typeof(User), PropertyName = nameof(User.PasswordHash))]
    public string Password { get; set; }

    [Compare(nameof(Password), ErrorMessage = "Пароли не совпадают")]
    [MapPropertyName(ForClass = typeof(User), PropertyName = "")]
    public string ConfirmPassword { get; set; }

    [Required(ErrorMessage = "Введите имя")]
    public string FirstName { get; set; }
    [Required(ErrorMessage = "Введите фамилию")]
    public string MiddleName { get; set; }
}
