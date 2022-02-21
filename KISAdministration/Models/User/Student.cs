using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KISAdministration.Models;
public record Student
{
    [Key]
    public Guid ObjectID { get; set; }

    [Required]
    [ForeignKey(nameof(UserID))]
    public User User { get; set; }
    public Guid UserID { get; set; }
}
