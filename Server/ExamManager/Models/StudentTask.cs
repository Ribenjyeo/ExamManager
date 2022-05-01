using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamManager.Models;

public record StudentTask
{
    [Key]
    public Guid ObjectID { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public StudentTask.TaskStatus Status { get; set; }
    public string Url { get; set; }

    [ForeignKey(nameof(StudentID))]
    public User Student { get; set; }
    public Guid StudentID { get; set; }

    [ForeignKey(nameof(AuthorID))]
    public User Author { get; set; }
    public Guid AuthorID { get; set; }

    public enum TaskStatus
    {
        CREATED,
        FAILED,
        SUCCESSED
    }
}