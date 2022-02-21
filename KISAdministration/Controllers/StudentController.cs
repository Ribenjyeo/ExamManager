using KISAdministration.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KISAdministration.Controllers
{
    [Route("student")]
    //[Authorize(Roles = "AuthenticatedOnly")]
    [NotDefaultUser("Home", nameof(HomeController.ChangeUserData))]
    public class StudentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
