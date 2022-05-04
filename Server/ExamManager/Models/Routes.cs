namespace ExamManager.Models;
public static class Routes
{
    public const string Login = "/login";
    public const string GetGroups = "/groups";

    #region USER

    public const string User  = "user";

    public const string GetUser  = "{id}";

    public const string GetUserTasks  = "{id}/tasks";

    public const string ModifyUser  = "modify";

    #endregion

    #region TASK

    public const string Task  = "task";
    public const string GetTask  = "{id}";
    public const string CreateTask  = "create";
    public const string DeleteTask  = "delete";
    public const string ModifyTask  = "modify";

    #endregion

    #region GROUP

    public const string Group  = "group";
    public const string CreateGroup  = "create";
    public const string GetGroup  = "{id}";
    public const string GetGroupStudents  = "{id}/students";
    public const string AddGroupStudent  = "students/add";
    public const string RemoveGroupStudent  = "students/remove";

    #endregion

    #region STUDENTS

    public const string GetUsers  = "/users";
    public const string CreateUsers  = "/users/create";
    public const string DeleteUsers  = "/users/delete";

    #endregion

    #region PAGES

    public const string LoginPage = "/pages/login";

    public const string HomePage = "/pages/home";

    public const string GroupsPage = "pages/groups";

    #endregion
}