using System.ComponentModel.DataAnnotations;

namespace ExamManager.Models;

public class Group
{
    [Key]
    public Guid ObjectID { get; set; }
    public string Name { get; set; }
    public IEnumerable<User> Students { get; set; }

}