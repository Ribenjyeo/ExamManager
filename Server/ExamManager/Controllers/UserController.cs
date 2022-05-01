using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using ExamManager.Models;
using ExamManager.Models.Response;
using Microsoft.AspNetCore.Authorization;
using ATMApplication.Filters;
using ExamManager.Filters;

namespace ExamManager.Controllers
{
    [Route(Routes.User)]
    [JwtAuthorize]
    public class UserController : Controller
    {
        IUserService _userService { get; set; }
        IMapper _mapper { get; set; }
        public UserController(IUserService userService,
            IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet(Routes.GetUser)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userService.GetUser(Guid.Parse(id));

            return Ok(ResponseFactory.CreateResponse(user));
        }

        [HttpGet(Routes.GetUserTasks)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetUserTasks(string id)
        {
            var userTasks = (await _userService.GetUser(Guid.Parse(id), includeTasks: true)).Tasks;
            if (userTasks is null || userTasks.Count == 0)
            {
                var exception = new InvalidDataException($"У пользователя {id} нет задач");
                return Ok(ResponseFactory.CreateResponse(exception));
            }

            return Ok(ResponseFactory.CreateResponse(userTasks));
        }
    }
}
