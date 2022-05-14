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
            var options = new UserOptions
            {
                Name = request.name,
                FirstName = request.firstName,
                LastName = request.lastName,
                WithoutGroups = request.withoutGroup,
                Role = request.role,
                GroupIds = request.groupIds,
                ExcludeGroupIds = request.excludeGroupIds,
                TaskStatus = request.taskStatus,
            };
            var users = await _userService.GetUsers(options, includeTasks: true, includeGroup: true);

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
                var newUsers = await _fileService.ParseExcelUsers(file, cancellationToken);
                users.AddRange(newUsers);
            }

            try
            {
                await _userService.RegisterUsers(users);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
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