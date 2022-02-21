using System.ComponentModel.DataAnnotations;

namespace KISAdministration.Models;

public class User
{
    [Key]
    public Guid ObjectID { get; set; }

    [Required(ErrorMessage = "Введите логин")]
    public string Login { get; set; }
    [Required(ErrorMessage = "Введите пароль")]
    public string PasswordHash { get; set; }

    [Required]
    public string FirstName { get; set; }
    [Required]
    public string MiddleName { get; set; }

    public UserRole Role { get; set; }

    public bool IsDefault { get; set; } = true;
}

public enum UserRole
{
    STUDENT = 1 << 0,
    ADMIN = 1 << 1
}