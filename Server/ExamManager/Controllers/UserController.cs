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
            var user = await _userService.GetUser(Guid.Parse(id), includeTasks: true, includeGroup: true);

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
    }
}
