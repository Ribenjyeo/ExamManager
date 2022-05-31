using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamManager.Models;

public record VirtualMachineImage
{
    [Key]
    public Guid ObjectID { get; set; }

    [Required]
    public string ID { get; set; }

    public string Title { get; set; }

    public int? Order { get; set; }

    [ForeignKey(nameof(TaskID))]
    public StudyTask Task { get; set; }
    public Guid TaskID { get; set; }
}
