using System.ComponentModel.DataAnnotations;

namespace KISAdministration.Models;

public record RegisterEditModel
{
    [Required(ErrorMessage = "Введите логин")]
    public string Login { get; set; }
    [Required(ErrorMessage = "Введите пароль")]
    public string Password { get; set; }

    [Compare(nameof(Password), ErrorMessage = "Пароли не совпадают")]
    public string ConfirmPassword { get; set; }

    [Required(ErrorMessage = "Введите имя")]
    public string FirstName { get; set; }
    [Required(ErrorMessage = "Введите фамилию")]
    public string MiddleName { get; set; }
}
