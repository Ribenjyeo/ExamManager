namespace ExamManager.Models.RequestModels;

public struct AddPersonalTasksRequest
{
    public Guid? taskId { get; set; }
    public Guid? student { get; set; }
    public Guid[]? tasks { get; set; }
    public Guid[]? students { get; set; }

}

public struct RemovePersonalTasksRequest
{
    public PersonalTaskView[]? personalTasks { get; set; }
    public struct PersonalTaskView
    {
        public Guid id { get; set; }
    }
}

public struct GetTasksRequest
{
    public string? title { get; set; }
    public Guid[]? studentIds { get; set; }
}

public struct CreateTaskRequest
{
    public string title { get; set; }
    public string? description { get; set; }
    public Guid[]? students { get; set; }
    public VirtualMachineView[] virtualMachines { get; set; }
    public struct VirtualMachineView
    {
        public string id { get; set; }
        public string? title { get; set; }
        public int? order { get; set; }
    }
}

public struct DeleteTaskRequest
{
    public Guid taskId { get; set; }
}

public struct ModifyTaskRequest
{
    public Guid taskId { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public Guid[]? students { get; set; }
}

public struct CreateGroupRequest
{
    public string name { get; set; }
}

public struct AddStudentsRequest
{
    public Guid groupId { get; set; }
    public StudentView[] students { get; set; }
    public struct StudentView
    {
        public Guid id { get; set; }
    }
}

public struct RemoveStudentsRequest
{
    public StudentView[]? students { get; set; }

    public struct StudentView
    {
        public Guid id { get; set; }
    }
}

public struct GetUsersRequest
{
    public string? name { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public bool? excludeYourself { get; set; }
    public bool? withoutGroup { get; set; }
    public Guid[]? groupIds { get; set; }
    public Guid[]? excludeGroupIds { get; set; }
    public Guid[]? taskIds { get; set; }
    public Guid[]? excludeTaskIds { get; set; }
    public Models.TaskStatus? taskStatus { get; set; }
    public UserRole? role { get; set; }
}

public struct CreateUsersRequest
{
    public UserView[] users { get; set; }
    public struct UserView
    {
        public string login { get; set; }
        public string password { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public UserRole role { get; set; }
        public Guid? groupId { get; set; }
    }
}

public struct DeleteUsersRequest
{
    public StudentView[] users { get; set; }
    public struct StudentView
    {
        public Guid id { get; set; }
        public bool onlyLogin { get; set; }
    }
}

public struct GetGroupsRequest
{
    public string? name { get; set; }
    public int? minStudentsCount { get; set; }
    public int? maxStudentsCount { get; set; }
    public int? count { get; set; }
}

public struct ModifyUserRequest
{
    public Guid id { get; set; }
    public string? login { get; set; }
    public string? password { get; set; }
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public UserRole? role { get; set; }
    public bool? isDefault { get; set; }
}