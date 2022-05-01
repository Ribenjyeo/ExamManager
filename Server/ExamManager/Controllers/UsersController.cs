using AutoMapper;
using ExamManager.Extensions;
using ExamManager.Filters;
using ExamManager.Services;
using ExamManager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamManager.Models.RequestModels;

namespace ExamManager.Controllers
{
    [ApiController]
    [JwtAuthorize]
    public class UsersController : ControllerBase
    {
        IUserService _userService { get; set; }
        IGroupService _groupService { get; set; }
        IMapper _mapper { get; set; }
        public UsersController(IUserService userService,
            IMapper mapper,
            IGroupService groupService)
        {
            _userService = userService;
            _mapper = mapper;
            _groupService = groupService;
        }

        [HttpGet(Routes.GetUsers)]
        public async Task<IActionResult> GetUsers([FromBody] GetUsersRequest request)
        {
            var users = await _userService.GetUsers(user =>
            {
                return (request.groupId is null ? true : user.StudentGroupID == request.groupId) &&
                       (request.role is null ? true : user.Role == request.role) &&
                       (request.taskStatus is null ? true : user.Tasks.Any(t => t.Status == request.taskStatus));
            });

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

            var registeredUsers = await _userService.RegisterUsers(users);

            return Ok(ResponseFactory.CreateResponse(registeredUsers));
        }

        [HttpPost(Routes.DeleteUsers)]
        public async Task<IActionResult> DeleteUsers([FromBody] DeleteUsersRequest request)
        {
            await _userService.DeleteUsers(request.users.Select(u => u.id).ToHashSet());

            return Ok(ResponseFactory.CreateResponse());
        }
    }
}