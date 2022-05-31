using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamManager.Models;


public class PersonalTask
{
    [Key]
    public Guid ObjectID { get; set; }

    [ForeignKey(nameof(TaskID))]
    public StudyTask Task { get; set; }
    public Guid TaskID { get; set; }

    [ForeignKey(nameof(StudentID))]
    public User Student { get; set; }
    public Guid StudentID { get; set; }

    public TaskStatus Status { get; set; } = TaskStatus.FAILED;
}

public enum TaskStatus
{
    FAILED = 1 << 0,
    SUCCESSED = 1 << 1
}