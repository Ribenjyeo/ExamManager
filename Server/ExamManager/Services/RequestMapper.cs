using ExamManager.Models;
using ExamManager.Models.RequestModels;

namespace ExamManager.Services;

public static class RequestMapper
{
    static ISecurityService _securityService { get; set; }
    public static void AddRequestMapper(this IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();
        _securityService = serviceProvider.GetService<ISecurityService>();
    }

    public static UserOptions MapFrom(GetUsersRequest request, User? currentUser)
    {
        var options = new UserOptions
        {
            Name = request.name,
            FirstName = request.firstName,
            LastName = request.lastName,
            ExcludeYourself = request.excludeYourself,
            WithoutGroups = request.withoutGroup,
            Role = request.role,
            GroupIds = request.groupIds,
            ExcludeGroupIds = request.excludeGroupIds,
            TaskIds = request.taskIds,
            ExcludeTaskIds = request.excludeTaskIds,
            TaskStatus = request.taskStatus,

            CurrentUserID = currentUser?.ObjectID
        };

        return options;
    }

    public static (StudyTask NewTask, Guid[]? StudentIds) MapFrom(CreateTaskRequest request)
    {
        var task = new StudyTask
        {
            Title = request.title,
            Description = request.description,
            VirtualMachines = request.virtualMachines?.Select(vm =>
            new VirtualMachineImage
            {
                ID = vm.id,
                Title = vm.title ?? string.Empty,
                Order = vm.order
            }).ToArray()
        };

        return (task, request.students);
    }

    public static IEnumerable<User> MapFrom(CreateUsersRequest request)
    {
        var users = request.users.Select(u => new User
        {
            FirstName = u.firstName,
            LastName = u.lastName,
            Login = u.login,
            PasswordHash = _securityService.Encrypt(u.password),
            Role = u.role,
            StudentGroupID = u.groupId
        });

        return users;
    }

    public static string MapFrom(CreateGroupRequest request)
    {
        return request.name;
    }

    public static (Guid TaskID,StudyTask NewTask, Guid[]? Students) MapFrom(ModifyTaskRequest request)
    {
        var newTask = new StudyTask
        {
            Title = request.title,
            Description = request.description
        };

        return (request.taskId, newTask, request.students);
    }

    public static IEnumerable<Guid> MapFrom(AddPersonalTasksRequest request)
    {
        return request.tasks;
    }

    public static IEnumerable<Guid> MapFrom(RemovePersonalTasksRequest request)
    {
        return request.personalTasks?.Select(task => task.id) ?? new List<Guid>();
    }

    public static StudyTaskOptions MapFrom(GetTasksRequest request)
    {
        var isNumber = ushort.TryParse(request.title, out var number);

        return new StudyTaskOptions
        {
            Title = request.title,
            Number = isNumber ? number : null,
            StudentIds = request.studentIds
        };
    }

}