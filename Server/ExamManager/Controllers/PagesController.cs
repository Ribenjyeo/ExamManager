﻿using ATMApplication.Filters;
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
        IStudentTaskService _taskService { get; set; }
        public PagesController(IMapper mapper, IGroupService groupService, IUserService userService, IStudentTaskService taskService)
        {
            _mapper = mapper;
            _groupService = groupService;
            _userService = userService;
            _taskService = taskService;
        }

        [HttpGet(Routes.LoginPage)]
        public IActionResult LoginPageIndex()
        {
            var user = (User)HttpContext.Items["User"];
            // Если пользователь не авторизован
            if (user is null)
            {
                return View("Login");
            }

            return RedirectToAction(nameof(HomePageIndex));
        }

        [HttpGet(Routes.HomePage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public IActionResult HomePageIndex()
        {
            var user = (User)HttpContext.Items["User"];

            if (user.IsDefault)
            {
                RedirectToAction(nameof(LoginPageIndex));
            }
            //// Если пользователь не администратор
            //var view = user.Role switch
            //{
            //    UserRole.ADMIN => View("Admin", user),
            //    UserRole.STUDENT => View("User", user)
            //};

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
            var user = (User)HttpContext.Items["User"];

            return View("Groups", user);
        }

        [HttpGet(Routes.SettingsPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public IActionResult SettingsPageIndex()
        {
            var user = (User)HttpContext.Items["User"];

            return View("Settings", user);
        }

        [HttpGet(Routes.GroupPage)]
        [ValidateGuidFormat("id")]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.ADMIN)]
        public async Task<IActionResult> GroupPageIndex(string id)
        {
            var groupId = Guid.Parse(id);
            var user = (User)HttpContext.Items["User"];
            var group = await _groupService.GetGroup(groupId);

            return View("Group", (user, group));
        }

        [HttpGet(Routes.StudentsPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.ADMIN)]
        public async Task<IActionResult> StudentsPageIndex()
        {
            var user = (User)HttpContext.Items["User"];
            return View("Students", user);
        }

        [HttpGet(Routes.TaskPage)]
        [ValidateGuidFormat("id", "student")]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        public async Task<IActionResult> TaskPageIndex([FromQuery] string id, [FromQuery] string student)
        {
            var user = (User)HttpContext.Items["User"];
            var taskId = Guid.Parse(id);

            var task = await _taskService.GetStudentTask(taskId);
            return View("Task", (user, task));
        }

        [HttpGet(Routes.NewTaskPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [ValidateGuidFormat("student")]
        [OnlyUserRole(UserRole.ADMIN)]
        public async Task<IActionResult> NewTaskPageIndex([FromQuery] string student)
        {
            if ((await _userService.GetUser(Guid.Parse(student))) is null)
            {
                return RedirectToAction(nameof(HomePageIndex));
            }

            var user = (User)HttpContext.Items["User"];
            var task = new StudentTask
            {
                AuthorID = user.ObjectID,
                StudentID = Guid.Parse(student),
                Status = StudentTask.TaskStatus.CREATED,
                Title = string.Empty,
                Description = string.Empty,
                Url = string.Empty
            };
            
            return View("Task", (user, task));
        }

        [HttpGet(Routes.TasksPage)]
        [JwtAuthorize(RedirectUrl: "/pages/login")]
        [OnlyUserRole(UserRole.STUDENT)]
        public async Task<IActionResult> TasksPageIndex()
        {
            var user = (User)HttpContext.Items["User"];

            return View("Tasks", user);
        }
    }
}
