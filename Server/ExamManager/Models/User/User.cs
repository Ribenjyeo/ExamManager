using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamManager.Models;

public class User : IUserValidationModel
{
    [Key]
    public Guid ObjectID { get; set; }

    [Required]
    public string Login { get; set; }
    [Required]
    public string PasswordHash { get; set; }
    [Required]
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public UserRole Role { get; set; }

    public bool IsDefault { get; set; } = true;

    [ForeignKey(nameof(StudentGroupID))]
    public Group? StudentGroup { get; set; }
    public Guid? StudentGroupID { get; set; }
    public List<StudentTask> Tasks { get; set; }

    public string GetFirstName() => FirstName;
    public string GetLogin() => Login;
    public string GetLastName() => LastName;
    public Guid GetObjectID() => ObjectID;
}

public enum UserRole
{
    ADMIN = 0,
    STUDENT = 1 << 0
}