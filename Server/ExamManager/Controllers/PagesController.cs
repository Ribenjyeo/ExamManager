using AutoMapper;
using ExamManager.Filters;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExamManager.Controllers
{
    public class PagesController : Controller
    {
        IMapper _mapper { get; set; }
        public PagesController(IMapper mapper)
        {
            _mapper = mapper;
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
            // Если пользователь не администратор
            var view = user.Role switch
            {
                UserRole.ADMIN => View("Admin", _mapper.Map<User, UserViewModel>(user)),
                UserRole.STUDENT => View("Student", _mapper.Map<User, UserViewModel>(user))
            };

            return view;
        }

        [HttpGet(Routes.GroupsPage)]
        [JwtAuthorize]
        public IActionResult GroupsPageIndex()
        {
            return View("Groups");
        }
    }
}
