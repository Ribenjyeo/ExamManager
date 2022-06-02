using ATMApplication.Filters;
using AutoMapper;
using ExamManager.Filters;
using ExamManager.Models;
using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExamManager.Controllers
{
    public class PagesController : Controller
    {
        IMapper _mapper { get; set; }
        IGroupService _groupService { get; set; }
        IUserService _userService { get; set; }
        IStudyTaskService _taskService { get; set; }
        public PagesController(IMapper mapper, IGroupService groupService, IUserService userService, IStudyTaskService taskService)
        {
            _mapper = mapper;
            _groupService = groupService;
            _userService = userService;
            _taskService = taskService;
        }


        [HttpGet("/")]
        [HttpGet("/pages")]
        public IActionResult DefaultRedirect()
        {
            return RedirectToAction(nameof(LoginPageIndex));
        }

        [HttpGet(Routes.LoginPage)]
        public IActionResult LoginPageIndex()
        {
            var user = (User?)HttpContext.Items["User"];
            // Если пользователь не авторизован
            if (user is null || user.IsDefault)
            {
                return View("Login");
            }

            return RedirectToAction(nameof(HomePageIndex));
        }

        [HttpGet(Routes.HomePage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public IActionResult HomePageIndex()
        {
            var user = (User?)HttpContext.Items["User"];

            if (user.IsDefault)
            {
                RedirectToAction(nameof(LoginPageIndex));
            }

            var view = user.Role switch
            {
                UserRole.ADMIN => RedirectToAction(nameof(GroupsPageIndex)),
                UserRole.STUDENT => RedirectToAction(nameof(TasksPageIndex))
            };

            return view;
        }

        [HttpGet(Routes.GroupsPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.ADMIN)]
        public IActionResult GroupsPageIndex()
        {
            var user = (User?)HttpContext.Items["User"];

            return View("Groups", user);
        }

        [HttpGet(Routes.SettingsPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public IActionResult SettingsPageIndex()
        {
            var user = (User?)HttpContext.Items["User"];

            return View("Settings", user);
        }

        [HttpGet(Routes.GroupPage)]
        [ValidateGuidFormat("id")]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.ADMIN, "/pages/login")]
        public async Task<IActionResult> GroupPageIndex(string id)
        {
            var groupId = Guid.Parse(id);
            var user = (User?)HttpContext.Items["User"];
            var group = await _groupService.GetGroup(groupId);

            return View("Group", (user, group));
        }

        [HttpGet(Routes.StudentsPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.ADMIN, "/pages/login")]
        public async Task<IActionResult> StudentsPageIndex()
        {
            var user = (User?)HttpContext.Items["User"];
            return View("Students", user);
        }

        [HttpGet(Routes.TaskPage)]
        [ValidateGuidFormat("id")]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public async Task<IActionResult> TaskPageIndex([FromQuery] string id)
        {
            var user = (User?)HttpContext.Items["User"];
            var taskId = Guid.Parse(id);

            // Если пользователь является администратором или преподавателем
            if((user.Role & (UserRole.ADMIN | UserRole.TEACHER)) == user.Role)
            {
                var task = await _taskService.GetStudyTaskAsync(taskId);
                if (task is null)
                {
                    return RedirectToAction(nameof(TasksPageIndex));
                }
                return View("Task", (user, task));
            }

            var personalTask = (await _taskService.GetPersonalTasksAsync(taskId))?.First();
            if (personalTask is null)
            {
                return RedirectToAction(nameof(TasksPageIndex));
            }
            var pTaskView = PersonalTaskView.MapFrom(personalTask);

            return View("PersonalTask", (user, pTaskView));
        }

        [HttpGet(Routes.NewTaskPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.ADMIN, "/pages/login")]
        public async Task<IActionResult> NewTaskPageIndex()
        {
            var user = (User?)HttpContext.Items["User"];
            var task = new StudyTask
            {
                Title = string.Empty,
                Description = string.Empty,
                Number = 0,
                VirtualMachines = new VirtualMachineImage[0]
            };
            
            return View("Task", (user, task));
        }

        [HttpGet(Routes.TasksPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public async Task<IActionResult> TasksPageIndex()
        {
            User user = (User?)HttpContext.Items["User"]!;

            IActionResult view = user.Role switch
            {
                UserRole.STUDENT => View("PersonalTasks", user),
                UserRole.ADMIN => View("Tasks", user),
                _ => Ok(ResponseFactory.CreateResponse(new Exception("")))
            };

            return view;
        }
    }
}
