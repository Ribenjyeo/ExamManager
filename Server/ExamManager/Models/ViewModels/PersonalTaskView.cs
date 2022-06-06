namespace ExamManager.Models;

public class PersonalTaskView
{
    public Guid? ObjectID { get; set; }
    public string? Title { get; set; }
    public ushort? Number { get; set; }
    public string Description { get; set; }
    public ICollection<(VirtualMachineImage Image, VirtualMachine? Instance)> VirtualMachines { get; set; }

    public static PersonalTaskView MapFrom(PersonalTask task)
    {
        var taskView = new PersonalTaskView
        {
            ObjectID = task.ObjectID,
            Title = task.Task.Title,
            Number = task.Task.Number,
            Description = task.Task.Description!,
        };

        taskView.VirtualMachines = new List<(VirtualMachineImage, VirtualMachine?)>();
        foreach (var vMachineImage in task.Task.VirtualMachines)
        {
            var vMachineInstance = task.VirtualMachines.FirstOrDefault(vm => vm.ImageID == vMachineImage.ObjectID);
            taskView.VirtualMachines.Add((vMachineImage, vMachineInstance));
        }

        return taskView;
    }
}
