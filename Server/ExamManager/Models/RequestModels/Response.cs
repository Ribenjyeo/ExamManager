using System.Net;

namespace ExamManager.Models.Response;

public record Response
{
    public HttpStatusCode status { get; set; }
    public string? message { get; set; }
    public string type { get => GetType().Name; }
}

public record JWTResponse : Response
{
    public string token { get; set; }
    public Guid id { get; set; }
    public bool isDefault { get; set; }
}

public record UserDataResponse : Response
{
    public Guid? id { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public UserRole? role { get; set; }
    public bool? isDefault { get; set; }
    public Guid? groupId { get; set; }
    public TaskView[]? tasks { get; set; }

    public struct TaskView
    {
        public Guid id { get; set; }
        public string title { get; set; }
    }
}

public record UsersDataResponse : Response
{
    public UserView[] users { get; set; }
    public struct UserView
    {
        public Guid id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string? groupName { get; set; }
        public TaskView[]? tasks { get; set; }
    }

    public struct TaskView
    {
        public string title { get; set; }
        public Models.TaskStatus status { get; set; }
    }
}

public record TasksDataResponse : Response
{
    public TaskView[] tasks { get; set; }
    public struct TaskView
    {
        public Guid id { get; set; }
        public ushort? number { get; set; }
        public string? title { get; set; }
        public string description { get; set; }
    }
}

public record TaskDataResponse : Response
{
    public Guid? id { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public VirtualMachineView[]? virtualMachines { get; set; }
    public UserView[]? students { get; set; }
    public struct VirtualMachineView
    {
        public string id { get; set; }
    }

    public struct UserView
    {
        public Guid id { get; set; }
        public string fullName { get; set; }
    }

}

public record TaskStatusResponse : Response
{
    public string id { get; set; }
    public string vMachine { get; set; }
    public VMStatus status { get; set; }
}

public record PersonalTaskDataResponse : Response
{
    public string? title { get; set; }
    public ushort number { get; set; }
    public string description { get; set; }
    public TaskStatus status { get; set; }
    public string? message { get; set; }
    public VirtualMachineView[]? virtualMachines { get; set;}

    public struct VirtualMachineView
    {
        public Image image { get; set; }
        public Instance instance { get; set; }
        public struct Image
        {
            public string id { get; set; }
        }
        public struct Instance
        {
            public VMStatus status { get; set; }
        }
    }
}

public record PersonalTasksDataResponse : Response
{
    public PersonalTaskView[]? personalTasks { get; set; }
    public struct PersonalTaskView
    {
        public Guid studentId { get; set; }
        public TaskView[] tasks { get; set; }
        public struct TaskView
        {
            public Guid id { get; set; }
            public string title { get; set; }
            public string? description { get; set; }
            public ushort number { get; set; }
            public Models.TaskStatus status { get; set; }
        }
    }
}

public record GroupDataResponse : Response
{
    public Guid? id { get; set; }
    public string? name { get; set; }
    public int? studentsCount { get; set; }
}

public record GroupsDataResponse : Response
{
    public GroupView[] groups { get; set; } = new GroupView[0];
    public struct GroupView
    {
        public Guid? id { get; set; }
        public string? name { get; set; }
        public int? studentsCount { get; set; }
    }
}

public record ErrorsResponse : Response
{
    public Dictionary<string, List<string>>? errors { get; set; }
}

public record BadResponse : Response
{
    public string exceptionType { get; set; }
    public string message { get; set; }
    public string stackTrace { get; set; }
}