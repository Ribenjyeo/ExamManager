using ExamManager.Extensions;
using AutoMapper;
using ExamManager.Models;
using ExamManager.Services;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace ExamManager.Controllers
{
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private IUserService _userService { get; set; }
        public IMapper _mapper { get; set; }
        SignInManager _signInManager { get; set; }

        public HomeController(ILogger<HomeController> logger,
            IUserService userService,
            IMapper mapper,
            SignInManager signInManager)
        {
            _logger = logger;
            _userService = userService;
            _mapper = mapper;
            _signInManager = signInManager;
        }

        [HttpPost(Routes.Login)]
        public async Task<IActionResult> Login([FromBody] LoginEditModel model,
                                   [FromServices] IUserService userService)
        {
            if (!ModelState.IsValid)
            {
                return Ok(ResponseFactory.CreateResponse(ModelState));
            }

            var user = await userService.GetUser(model.Login, model.Password);
            if (user is null)
            {
                ModelState.AddModelError("Default", "Пользователя с такими логином и паролем не существует");
                return Ok(ResponseFactory.CreateResponse(ModelState));
            }

            var token = string.Empty;
            try
            {
                token = _signInManager.LogIn().UsingJWT(user);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Default", ex.Message);
                return Ok(ResponseFactory.CreateResponse(ModelState));
            }

            return Ok(ResponseFactory.CreateResponse(token, user.ObjectID));
        }        
    }
}