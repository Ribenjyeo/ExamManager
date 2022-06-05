using AutoMapper;
using ExamManager.Extensions;
using ExamManager.Filters;
using ExamManager.Services;
using ExamManager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamManager.Models.RequestModels;
using System.Linq;
using OfficeOpenXml;

namespace ExamManager.Controllers
{
    [ApiController]
    [OnlyUserRole(Role: UserRole.ADMIN)]
    [JwtAuthorize]
    public class UsersController : ControllerBase
    {
        IUserService _userService { get; set; }
        IGroupService _groupService { get; set; }
        IFileService _fileService { get; set; }
        IMapper _mapper { get; set; }
        public UsersController(IUserService userService,
            IMapper mapper,
            IGroupService groupService,
            IFileService fileService)
        {
            _userService = userService;
            _mapper = mapper;
            _groupService = groupService;
            _fileService = fileService;
        }

        [HttpPost(Routes.GetUsers)]
        public async Task<IActionResult> GetUsers([FromBody] GetUsersRequest request)
        {
            var user = (User)HttpContext.Items["User"]!;
            var options = RequestMapper.MapFrom(request, user);
            var users = await _userService.GetUsers(options, includePersonalTasks: true, includeGroup: true, includeTasks: true);

            if (options.ExcludeYourself ?? false)
            {
                users = users.Where(u => u.ObjectID != user.ObjectID);
            }

            return Ok(ResponseFactory.CreateResponse(users));
        }

        [HttpPost(Routes.CreateUsers)]
        public async Task<IActionResult> CreateUsers([FromBody] CreateUsersRequest request)
        {
            var users = request.users.AsParallel().Select(user =>
            {
                var groupId = user.groupId;
                var registerUser = new RegisterEditModel
                {
                    Login = user.login,
                    Password = user.password,
                    FirstName = user.firstName,
                    LastName = user.lastName,
                    Role = user.role
                };

                var newUser = _mapper.Map<RegisterEditModel, User>(registerUser);
                newUser.StudentGroupID = groupId;

                return newUser;
            }).ToList();

            foreach (var user in users)
            {
                var validationResult = await _userService.ValidateUser(user);
                if (validationResult.HasErrors)
                {
                    // TODO: Передавать данные по неудачной валидации о каждом пользователе
                    ModelState.AddErrors(validationResult.ErrorMessages);
                    return Ok(ResponseFactory.CreateResponse(ModelState));
                }
            }

            var registeredUsers = new List<User>(users.Count);
            // TODO: Добавить метод добавления нескольких пользователей
            foreach (var user in users)
            {
                var registeredUser = await _userService.RegisterUser(user);
                registeredUsers.Add(registeredUser);
            }

            return Ok(ResponseFactory.CreateResponse(registeredUsers));
        }

        [HttpPost(Routes.CreateUsersFromFile)]
        public async Task<IActionResult> CreateUsersFromFile(IList<IFormFile> files, CancellationToken cancellationToken)
        {
            var users = new List<User>();
            foreach (var file in files)
            {
                try
                {
                    var groups = new Dictionary<string, Guid>();
                    var newUsers = (await _fileService.ParseUsersFromFile(file, cancellationToken)).ToArray();
                    for (int i = 0; i < newUsers.Length; i++)
                    {
                        var group = await _groupService.GetGroup(newUsers[i].GroupName);
                        if (group is null)
                        {
                            group = await _groupService.CreateGroup(newUsers[i].GroupName);
                        }

                        if (!groups.ContainsKey(newUsers[i].GroupName))
                        {
                            groups.Add(newUsers[i].GroupName, group.ObjectID);
                        }
                        newUsers[i].User.StudentGroupID = groups[newUsers[i].GroupName];
                    }
                    await _userService.RegisterUsers(newUsers.Select(u => u.User));
                }
                catch (Exception ex)
                {
                    return Ok(ResponseFactory.CreateResponse(ex));
                }
            }

            return Ok(ResponseFactory.CreateResponse(users));
        }

        [HttpPost(Routes.DeleteUsers)]
        public async Task<IActionResult> DeleteUsers([FromBody] DeleteUsersRequest request)
        {
            await _userService.DeleteUsers(request.users.Select(u => u.id).ToHashSet());

            return Ok(ResponseFactory.CreateResponse());
        }
    }
}