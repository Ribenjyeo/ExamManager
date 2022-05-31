using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamManager.Models;

public record VirtualMachine
{
    [Key]
    public Guid ObjectID { get; set; }

    public string Name { get; set; }
    public string Host { get; set; }
    public ushort Port { get; set; }
    public string Password { get; set; }
    public VMStatus Status { get; set; }

    [ForeignKey(nameof(OwnerID))]
    public User Owner { get; set; }
    public Guid OwnerID { get; set; }

    [ForeignKey(nameof(TaskID))]
    public PersonalTask Task { get; set; }
    public Guid TaskID { get; set; }
}

public enum VMStatus
{
    RUNNING = 1 << 0,
    KILLED = 1 << 1
}

public static class VirtualMachineExtensions
{
    public static string ToLowerString(this VMStatus status) => status.ToString().ToLower();
}