using KISAdministration.Extensions;
using AutoMapper;
using KISAdministration.Models;
using KISAdministration.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace KISAdministration.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IUserService _userService { get; set; }
        public IMapper _mapper { get; set; }

        public HomeController(ILogger<HomeController> logger,
            IUserService userService,
            IMapper mapper)
        {
            _logger = logger;
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("/home")]
        public async Task<IActionResult> Index()
        {
            if (User.Identity?.IsAuthenticated ?? false)
            {
                return await RedirectAfterAuthorization();
            }
            return View();
        }

        [HttpPost("/login")]
        public async Task<IActionResult> Login(LoginEditModel model,
                                   [FromServices] IUserService userService)
        {
            if (!ModelState.IsValid)
            {
                return View("Index", model);
            }

            var user = await userService.GetUser(model.Login, model.Password);
            if (user is null)
            {
                ModelState.AddModelError(string.Empty, "Пользователя с такими логином и паролем не существует");
                return View("Index", model);
            }
            var principal = await userService.CreateUserPrincipal(user);
            var signInService = new SignInService();

            try
            {
                await signInService.LogIn().WithClaims(HttpContext, principal);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);
                return View("Index", model);
            }

            return RedirectToAction(nameof(ChangeUserData), new { pageId = 1 });
        }

        [HttpGet("/change")]
        public async Task<IActionResult> ChangeUserData(int pageId,
                                                        [FromServices] IUserService userService)
        {
            var userId = Guid.Parse(User.GetClaim(ClaimKey.Id));
            var user = await userService.GetUser(userId);

            var action = pageId switch
            {
                1 when !user.IsDefault => await RedirectAfterAuthorization(),
                2 when user.IsDefault => RedirectToAction(nameof(ChangeUserData), new { pageId = 1 }),
                > 2 => await RedirectAfterAuthorization(),
                _ => View()
            };

            return action;
        }

        [HttpPost("/change")]
        public async Task<IActionResult> ChangeUserData(RegisterEditModel model,
                                                        [FromQuery] int pageId,
                                                        [FromServices] ISecurityService securityService)
        {
            string[] fields = new string[0];

            if (pageId == 1)
            {
                fields = new string[]
                {
                    nameof(RegisterEditModel.Login),
                    nameof(RegisterEditModel.Password),
                    nameof(RegisterEditModel.ConfirmPassword)
                };
            }
            else if (pageId == 2)
            {

                fields = new string[]
                {
                    nameof(RegisterEditModel.FirstName),
                    nameof(RegisterEditModel.MiddleName)
                };
            }

            if (!await ChangeUserData(model, fields))
            {
                return View(model);
            }

            return pageId switch
            {
                1 => RedirectToAction(nameof(HomeController.ChangeUserData), new { pageId = 2 }),
                2 => await RedirectAfterAuthorization()
            };
        }

        [HttpGet("/logout")]
        public async Task<IActionResult> Logout()
        {
            var signInService = new SignInService();
            await signInService.LogOut().WithClaims(HttpContext);

            return RedirectToAction("Index", "Home");
        }

        private async Task<IActionResult> RedirectAfterAuthorization()
        {
            if (!Guid.TryParse(User.GetClaim(ClaimKey.Id), out var userId))
            {
                return RedirectToAction(nameof(Index));
            }
            var user = await _userService.GetUser(userId);

            var action = user switch
            {
                null => throw new ArgumentNullException(),
                { IsDefault: true } => RedirectToAction(nameof(ChangeUserData), new { pageId = 1 }),
                { Role: UserRole.ADMIN } => RedirectToAction(nameof(AdminController.Index), "Admin"),
                { Role: UserRole.STUDENT } => RedirectToAction(nameof(AdminController.Index), "Student"),
                _ => throw new InvalidOperationException()
            };

            return action;
        }

        private async Task<bool> ChangeUserData(RegisterEditModel model, params string[] fieldsToChange)
        {
            foreach (var errorField in ModelState.Keys)
            {
                if (!fieldsToChange.Contains(errorField))
                {
                    ModelState.Remove(errorField);
                }
            }

            if (!ModelState.IsValid)
            {
                return false;
            }

            var userId = Guid.Parse(User.GetClaim(ClaimKey.Id));
            var userType = typeof(User);
            var registeredUser = _mapper.Map<RegisterEditModel, User>(model);

            // Преобразование названий свойств из RegisterEditModel в User
            var userFieldsDict = new Dictionary<string, string>()
            {
                { nameof(RegisterEditModel.Password), nameof(Models.User.PasswordHash) },
                { nameof(RegisterEditModel.ConfirmPassword), null }
            };
            List<(string Name, object Value)> fieldsNameValue = fieldsToChange
                // Убираем свойства, которые не присутствуют в User (например, свойство, где повторно написан пароль)
                .Where(fieldName => !userFieldsDict.ContainsKey(fieldName) || !string.IsNullOrEmpty(userFieldsDict[fieldName]))
                .Select(fieldName =>
                {
                    var name = userFieldsDict.ContainsKey(fieldName) ? userFieldsDict[fieldName] : fieldName;
                    var value = userType.GetProperty(name)!.GetValue(registeredUser);
                    return (name, value);
                })
                .ToList()!;
            fieldsNameValue.Add((nameof(Models.User.IsDefault), false));

            var user = await _userService.ChangeUserData(userId, fieldsNameValue.ToArray());

            if (user is null)
            {
                ModelState.AddModelError(string.Empty, "Пользователь не найден");
                return false;
            }

            return true;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}