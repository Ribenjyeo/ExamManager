using AutoMapper;
using KISAdministration.Extensions;
using KISAdministration.Filters;
using KISAdministration.Services;
using KISAdministration.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KISAdministration.Controllers
{
    [Route("student")]
    [Authorize]
    [NotDefaultUser("Home", nameof(HomeController.ChangeUserData), "pageId", 1)]
    public class StudentController : Controller
    {
        IUserService _userService { get; set; }
        IMapper _mapper { get; set; }
        public StudentController(IUserService userService,
            IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }
        public async Task<IActionResult> Index()
        {
            var userId = Guid.Parse(User.GetClaim(ClaimKey.Id));
            var user = await _userService.GetUser(userId);
            var userView = _mapper.Map<User, UserViewModel>(user);

            return View(userView);
        }
    }
}
