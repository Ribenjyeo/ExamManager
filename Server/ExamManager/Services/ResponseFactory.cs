using ExamManager.Models;
using ExamManager.Models.Response;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace ExamManager.Services;

public static class ResponseFactory
{
    /// <summary>
    /// Создает пустой <see cref="Response"/>
    /// </summary>
    public static Response CreateResponse()
    {
        return new Response
        {
            status = HttpStatusCode.OK
        };
    }

    public static Response CreateResponse(string message, HttpStatusCode statusCode)
    {
        return new Response
        {
            message = message,
            status = statusCode
        };
    }

    public static Response CreateResponse(ModelStateDictionary modelState)
    {
        Response response = null;

        if (!modelState.IsValid)
        {
            response = new BadResponse
            {
                status = HttpStatusCode.BadRequest,
                errors = CreateDictionary(modelState)
            };
        }
        else
        {
            response = new Response
            {
                status = HttpStatusCode.OK
            };
        }

        return response;
    }
    public static Response CreateResponse(string jwtToken, Guid userId, bool isDefault = false)
    {
        return new JWTResponse
        {
            status = HttpStatusCode.OK,
            token = jwtToken,
            id = userId,
            isDefault = isDefault
        };
    }
    public static Response CreateResponse(Exception ex)
    {
        return new ExceptionResponse
        {
            exceptionType = ex.GetType().Name,
            status = HttpStatusCode.BadRequest,
            message = ex.Message,
            stackTrace = ex.StackTrace
        };
    }

    public static Response CreateResponse(User user)
    {
        if (user is null)
        {
            return new UserDataResponse
            {
                status = HttpStatusCode.BadRequest,
                id = null,
                firstName = null,
                lastName = null,
                role = null,
                isDefault = null,
                groupId = null,
                tasks = null
            };
        }

        return new UserDataResponse
        {
            status = HttpStatusCode.OK,
            id = user.ObjectID,
            firstName = user.FirstName,
            lastName = user.LastName,
            role = user.Role,
            isDefault = user.IsDefault,
            groupId = user.StudentGroupID,
            tasks = user.Tasks?.Select(task => new UserDataResponse.TaskView
            {
                id = task.ObjectID,
                title = task.Title
            }).ToArray()
        };
    }

    public static Response CreateResponse(Group group)
    {
        if (group is null)
        {
            return new GroupDataResponse
            {
                status = HttpStatusCode.BadRequest,
                id = null,
                name = null,
                studentsCount = null
            };
        }

        return new GroupDataResponse
        {
            status = HttpStatusCode.OK,
            id = group.ObjectID,
            name = group.Name,
            studentsCount = group.Students?.Count()
        };
    }

    public static Response CreateResponse(IEnumerable<Group> groups)
    {
        if (groups is null)
        {
            return new GroupsDataResponse
            {
                status = HttpStatusCode.BadRequest,
                groups = new GroupsDataResponse.GroupView[0]
            };
        }

        return new GroupsDataResponse
        {
            status = HttpStatusCode.OK,
            groups = groups.Select(g => 
            new GroupsDataResponse.GroupView
            {
                id = g.ObjectID,
                studentsCount = g.Students?.Count() ?? 0,
                name = g.Name
            }).ToArray()
        };
    }

    /// <summary>
    /// Создает тело ответа
    /// </summary>
    /// <param name="users">Пользователи</param>
    /// <param name="groupName">Группа, в которой состоят пользователи</param>
    /// <returns><see cref="UsersDataResponse"/></returns>
    public static Response CreateResponse(IEnumerable<User> users, string groupName = null)
    {
        if (users is null)
        {
            return new UsersDataResponse
            {
                status = HttpStatusCode.BadRequest,
                users = null
            };
        }

        return new UsersDataResponse
        {
            status = HttpStatusCode.OK,
            users = users.Select(u =>
            new UsersDataResponse.UserView
            {
                id = u.ObjectID.ToString(),
                firstName = u.FirstName,
                lastName = u.LastName,
                groupName = groupName ?? u.StudentGroup?.Name
            }).ToArray()
        };
    }

    public static Response CreateResponse(StudentTask task)
    {
        if (task is null)
        {
            return new TaskDataResponse
            {
                status = HttpStatusCode.BadRequest,
                id = null,
                title = null,
                description = null,
                authorId = null,
                url = null,
                taskStatus = StudentTask.TaskStatus.CREATED
            };
        }

        return new TaskDataResponse
        {
            status = HttpStatusCode.OK,
            id = task.ObjectID,
            title = task.Title,
            description = task.Description,
            authorId = task.AuthorID,
            url = task.Url,
            taskStatus = task.Status
        };
    }

    public static Response CreateResponse(IEnumerable<StudentTask> tasks)
    {
        if (tasks is null)
        {
            return new TasksDataResponse
            {
                status = HttpStatusCode.BadRequest,
                tasks = null
            };
        }

        return new TasksDataResponse
        {
            status = HttpStatusCode.OK,
            tasks = tasks.Select(t =>
                new TasksDataResponse.TaskView
                {
                    id = t.ObjectID,
                    title = t.Title,
                    description = t.Description,
                    studentId = t.StudentID,
                    taskStatus = t.Status
                }
            ).ToArray()
        };
    }

    private static Dictionary<string, List<string>> CreateDictionary(ModelStateDictionary modelState)
    {
        var errors = new Dictionary<string, List<string>>();
        foreach (var error in modelState)
        {
            if (error.Value.Errors.Count > 0)
            {
                errors.Add(error.Key, error.Value.Errors.Select(msg => msg.ErrorMessage).ToList());
            }
        }

        return errors;
    }
}
