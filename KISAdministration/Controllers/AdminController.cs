using KISAdministration.Extensions;
using KISAdministration.Models;
using AutoMapper;
using KISAdministration.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using KISAdministration.Filters;

namespace KISAdministration.Controllers
{

    [Route("admin")]
    [Authorize]
    [NotDefaultUser("Home", nameof(HomeController.ChangeUserData), "pageId", 1)]
    public class AdminController : Controller
    {
        IUserService _userService { get; set; }
        IMapper _mapper { get; set; }
        IGroupService _groupService { get; set; }
        public AdminController(IUserService userService,
            IMapper mapper,
            IGroupService groupService)
        {
            _userService = userService;
            _mapper = mapper;
            _groupService = groupService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var userId = Guid.Parse(User.GetClaim(ClaimKey.Id));
            var user = await _userService.GetUser(userId);
            var userView = _mapper.Map<User, UserViewModel>(user);
            
            return View(userView);
        }

        [HttpPost("group/create")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var createdGroup = new Group();
            try
            {
                createdGroup = await _groupService.CreateGroup(request.GroupName);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }

            if (createdGroup is null)
            {
                return Ok("Не удалось создать группу");
            }

            return Ok(createdGroup);
        }
    }
}
