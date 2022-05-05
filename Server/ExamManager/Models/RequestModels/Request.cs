namespace ExamManager.Models.RequestModels;

public struct CreateTaskRequest
{
    public string title { get; set; }
    public string? description { get; set; }
    public string url { get; set; }
    public Guid studentId { get; set; }
    public Guid? authorId { get; set; }
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
    public Guid? studentId { get; set; }
    public Guid? authorId { get; set; }
    public StudentTask.TaskStatus? status { get; set; }
    public string? url { get; set; }
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
    public StudentView[] students { get; set; }

    public struct StudentView
    {
        public Guid id { get; set; }
    }
}

public struct GetUsersRequest
{
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public Guid? groupId { get; set; }
    public StudentTask.TaskStatus? taskStatus { get; set; }
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