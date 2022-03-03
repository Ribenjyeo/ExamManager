using System.ComponentModel.DataAnnotations;

namespace ExamManager.Models;

public class User : IUserValidationModel
{
    [Key]
    public Guid ObjectID { get; set; }

    [Required(ErrorMessage = "Введите логин")]
    public string Login { get; set; }
    [Required(ErrorMessage = "Введите пароль")]
    public string PasswordHash { get; set; }

    public string FirstName { get; set; }
    public string MiddleName { get; set; }

    public UserRole Role { get; set; }

    public bool IsDefault { get; set; } = true;
    public Group? StudentGroup { get; set; }

    public string GetFirstName() => FirstName;
    public string GetLogin() => Login;
    public string GetMiddleName() => MiddleName;
    public Guid GetObjectID() => ObjectID;
}

public enum UserRole
{
    STUDENT = 0,
    ADMIN = 1 << 0
}