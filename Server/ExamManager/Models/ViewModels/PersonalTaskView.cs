namespace ExamManager.Models;

public class PersonalTaskView
{
    public string? Title { get; set; }
    public ushort? Number { get; set; }
    public string Description { get; set; }
    public ICollection<(VirtualMachineImage Image, VirtualMachine? Instance)> VirtualMachines { get; set; }

    public static PersonalTaskView MapFrom(PersonalTask task)
    {
        var taskView = new PersonalTaskView
        {
            Title = task.Task.Title,
            Number = task.Task.Number,
            Description = task.Task.Description!,
        };

        taskView.VirtualMachines = new List<(VirtualMachineImage, VirtualMachine?)>();
        foreach (var vMachineImage in task.Task.VirtualMachines)
        {
            var vMachineInstance = task.VirtualMachines.FirstOrDefault(vm => vm.TaskID == vMachineImage.TaskID);
            taskView.VirtualMachines.Add((vMachineImage, vMachineInstance));
        }

        return taskView;
    }
}
