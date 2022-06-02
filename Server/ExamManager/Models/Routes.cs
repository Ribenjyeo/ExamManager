namespace ExamManager.Models;
public static class Routes
{
    public const string Login = "/login";
    public const string GetGroups = "/groups";

    #region USER

    public const string User = "user";
    public const string GetUser = "{id}";
    public const string GetUserTasks = "{id}/tasks";
    public const string ModifyUser = "modify";
    public const string AddUserTasks = "{id}/tasks/add";
    public const string RemoveUserTasks = "{id}/tasks/remove";

    #endregion

    #region TASK

    public const string Task = "task";
    public const string GetTask = "/task/{id}";
    public const string GetTasks = "/tasks";
    public const string CreateTask = "/task/create";
    public const string DeleteTask = "/task/delete";
    public const string ModifyTask = "/task/modify";
    public const string StartTask = "/task/{taskId}/start/{id}";
    public const string GetTaskStatus = "/task/{taskId}/status/{id}";
    public const string ConnectVirtualMachine = "/task/{taskId}/connect/{id}";
    public const string CheckTask = "/task/{taskId}/check";
    public const string StopTask = "/task/{taskId}/stop/{id}";

    #endregion

    #region GROUP

    public const string CreateGroup  = "/group/create";
    public const string GetGroup  = "/group/{id}";
    public const string DeleteGroup = "/group/{id}/delete";
    public const string GetGroupStudents  = "/group/{id}/students";
    public const string AddGroupStudents  = "/group/students/add";
    public const string RemoveGroupStudents  = "/group/students/remove";

    #endregion

    #region USERS

    public const string GetUsers  = "/users";
    public const string CreateUsers  = "/users/create";
    public const string CreateUsersFromFile  = "/users/create-from-file";
    public const string DeleteUsers  = "/users/delete";

    #endregion

    #region PAGES

    public const string LoginPage = "/pages/login";

    public const string HomePage = "/pages/home";

    public const string GroupsPage = "/pages/groups";

    public const string SettingsPage = "/pages/settings";

    public const string GroupPage = "/pages/group/{id}";

    public const string StudentsPage = "/pages/students";

    public const string TaskPage = "/pages/task";

    public const string NewTaskPage = "/pages/task/new";

    public const string TasksPage = "/pages/tasks";

    #endregion
}