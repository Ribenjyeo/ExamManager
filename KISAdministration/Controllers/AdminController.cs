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
        public AdminController(IUserService userService,
            IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var userId = Guid.Parse(User.GetClaim(ClaimKey.Id));
            var user = await _userService.GetUser(userId);
            var userView = _mapper.Map<Models.User, UserViewModel>(user);
            
            return View(userView);
        }
    }
}
