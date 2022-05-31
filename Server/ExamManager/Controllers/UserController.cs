using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using ExamManager.Models;
using ExamManager.Models.Response;
using Microsoft.AspNetCore.Authorization;
using ATMApplication.Filters;
using ExamManager.Filters;
using ExamManager.Models.RequestModels;
using ExamManager.Extensions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ExamManager.Controllers
{
    [Route(Routes.User)]
    [JwtAuthorize]
    public class UserController : Controller
    {
        IUserService _userService { get; set; }
        IStudyTaskService _taskService { get; set; }
        IMapper _mapper { get; set; }
        public UserController(IUserService userService,
            IMapper mapper, IStudyTaskService taskService)
        {
            _userService = userService;
            _mapper = mapper;
            _taskService = taskService;
        }

        [HttpGet(Routes.GetUser)]
        [OnlyUserRole(UserRole.ADMIN | UserRole.TEACHER)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userService.GetUser(Guid.Parse(id), includeTasks: true, includeGroup: true);

            return Ok(ResponseFactory.CreateResponse(user));
        }

        [HttpPost(Routes.ModifyUser)]
        public async Task<IActionResult> ModifyUser([FromBody] ModifyUserRequest request)
        {
            var properties = new List<Property>(4);
            var newUser = _mapper.Map<ModifyUserRequest, User>(request);

            foreach (var property in typeof(User).GetProperties())
            {
                var value = property.GetValue(newUser);
                var name = property.Name;
                if (value is not null && 
                    name != nameof(newUser.ObjectID) && 
                    (name != nameof(newUser.Role) || (UserRole)value == request.role) &&
                    (name != nameof(newUser.IsDefault) || (bool)value == request.isDefault))
                {
                    properties.Add(new Property 
                    { 
                        Name = name, 
                        Value = value 
                    });
                }
            }

            var result = await _userService.ChangeUserData(request.id, properties.ToArray());

            if (result.HasErrors)
            {
                var model = new ModelStateDictionary();
                model.AddErrors(result.ErrorMessages);

                return Ok(ResponseFactory.CreateResponse(model));
            }

            var user = await _userService.GetUser(request.id);
            return Ok(ResponseFactory.CreateResponse(user));
        }

        [HttpGet(Routes.GetUserTasks)]
        [OnlyUserRole(UserRole.ADMIN | UserRole.TEACHER)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetUserTasks(string id)
        {
            var studentId = Guid.Parse(id);

            var userTasks = await _taskService.GetPersonalTasksAsync(studentId);
            if (userTasks is null || userTasks.Count() == 0)
            {
                var exception = new InvalidDataException($"У пользователя {id} нет задач");
                return Ok(ResponseFactory.CreateResponse(exception));
            }

            return Ok(ResponseFactory.CreateResponse(userTasks));
        }

        [HttpPost(Routes.AddUserTasks)]
        [OnlyUserRole(UserRole.ADMIN | UserRole.TEACHER)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> AddUserTasks([FromBody] AddPersonalTasksRequest request, string id)
        {
            if (request.tasks is null)
            {
                return Ok(ResponseFactory.CreateResponse());
            }

            IEnumerable<PersonalTask> personalTasks;
            var studentId = Guid.Parse(id);
            var taskIds = RequestMapper.MapFrom(request);

            try
            {
                _ = taskIds.Count() > 1 ?
                    await _taskService.AssignTasksToStudentAsync(taskIds.ToArray(), studentId) :
                    new List<PersonalTask>() { await _taskService.AssignTaskToStudentAsync(taskIds.First(), studentId) };

                personalTasks = await _taskService.GetPersonalTasksAsync(studentId);
            }
            catch(Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            return Ok(ResponseFactory.CreateResponse(personalTasks));
        }

        [HttpPost(Routes.RemoveUserTasks)]
        [OnlyUserRole(UserRole.ADMIN | UserRole.TEACHER)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> RemoveUserTasks([FromBody] RemovePersonalTasksRequest request, string id)
        {
            var personalTaskIds = RequestMapper.MapFrom(request);
            if (personalTaskIds is null || personalTaskIds.Count() == 0)
            {
                return Ok(ResponseFactory.CreateResponse(new Exception("Задания не выбраны")));
            }

            try
            {
                await _taskService.WithdrawTasksFromStudentAsync(personalTaskIds.ToArray());
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            return Ok(ResponseFactory.CreateResponse());
        }
    }
}
