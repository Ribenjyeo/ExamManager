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
        if (!modelState.IsValid)
        {
            return new ErrorsResponse
            {
                status = HttpStatusCode.BadRequest,
                errors = CreateDictionary(modelState)
            };
        }
        return new Response
        {
            status = HttpStatusCode.OK
        };
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
        return new BadResponse
        {
            exceptionType = ex.GetType().Name,
            status = HttpStatusCode.BadRequest,
            message = ex.Message,
            stackTrace = ex.StackTrace ?? string.Empty
        };
    }

    public static Response CreateResponse(User? user)
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
            tasks = (user.Tasks?.Count ?? 0) > 0 ? user.Tasks?.Select(task => new UserDataResponse.TaskView
            {
                id = task.ObjectID,
                title = task.Task.Title!
            }).ToArray() : null
        };
    }

    public static Response CreateResponse(Group? group)
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
        if (groups is null || groups.Count() == 0)
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
    public static Response CreateResponse(IEnumerable<User>? users, string? groupName = null)
    {
        if ((users?.Count() ?? 0) == 0)
        {
            return new UsersDataResponse
            {
                status = HttpStatusCode.BadRequest,
                users = new UsersDataResponse.UserView[0]
            };
        }

        return new UsersDataResponse
        {
            status = HttpStatusCode.OK,
            users = users!.Select(u =>
            new UsersDataResponse.UserView
            {
                id = u.ObjectID,
                firstName = u.FirstName,
                lastName = u.LastName,
                groupName = groupName ?? u.StudentGroup?.Name,
                tasks = u.Tasks?.Select(task => new UsersDataResponse.TaskView
                {
                    title = task.Task.Title!,
                    status = task.Status
                }).ToArray()
            }).ToArray()
        };
    }

    public static Response CreateResponse(StudyTask task)
    {
        if (task is null)
        {
            return new TaskDataResponse
            {
                status = HttpStatusCode.BadRequest,
                id = null,
                title = null,
                description = null,
                virtualMachines = null,
                students = null
            };
        }

        return new TaskDataResponse
        {
            status = HttpStatusCode.OK,
            id = task.ObjectID,
            title = task.Title,
            description = task.Description,
            virtualMachines = task.VirtualMachines.Select(vm =>
            new TaskDataResponse.VirtualMachineView
            {
                id = vm.ID
            }).ToArray(),
            students = task.PersonalTasks?.Select(pTask => pTask.Student).Select(student => 
            new TaskDataResponse.UserView
            {
                id = student.ObjectID,
                fullName = $"{student.LastName} {student.FirstName}"
            }).ToArray()
        };
    }

    public static Response CreateResponse(IEnumerable<PersonalTask> tasks)
    {
        if (tasks is null)
        {
            return new PersonalTasksDataResponse
            {
                personalTasks = null
            };
        }

        var studentIds = tasks
            .Select(task => task.StudentID)
            .Distinct();

        return new PersonalTasksDataResponse
        {
            personalTasks = studentIds.Select(id => new PersonalTasksDataResponse.PersonalTaskView
            {
                studentId = id,
                tasks = tasks
                    .Where(task => task.StudentID == id)
                    .Select(task => new PersonalTasksDataResponse.PersonalTaskView.TaskView
                    {
                        id = task.ObjectID,
                        title = task.Task.Title,
                        description = task.Task.Description,
                        status = task.Status,
                        number = task.Task.Number.Value
                    })
                    .ToArray()
            }).ToArray()
        };
    }
    public static Response CreateResponse(IEnumerable<StudyTask> tasks)
    {
        if (tasks is null)
        {
            return new TasksDataResponse
            {
                status = HttpStatusCode.BadRequest,
                tasks = new TasksDataResponse.TaskView[0]
            };
        }

        return new TasksDataResponse
        {
            status = HttpStatusCode.OK,
            tasks = tasks.Select(t =>
                new TasksDataResponse.TaskView
                {
                    id = t.ObjectID,
                    number = t.Number,
                    title = t.Title,
                    description = t.Description
                }
            ).ToArray()
        };
    }

    public static Response CreateResponse(VMStatus vmStatus)
    {
        return new TaskStatusResponse
        {
            status = vmStatus
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
