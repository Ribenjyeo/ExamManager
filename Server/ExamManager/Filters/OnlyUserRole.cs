using ExamManager.Models;
using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ExamManager.Filters
{
    public class OnlyUserRole : Attribute, IAsyncActionFilter
    {
        UserRole _role { get; set; }
        string _redirectUrl { get; set; }
        public OnlyUserRole(UserRole Role, string RedirectUrl = null)
        {
            _role = Role;
            _redirectUrl = RedirectUrl;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var user = (User?)context.HttpContext.Items["User"];

            if (user is not null)
            {
                if ((user.Role & _role) != user.Role)
                {
                    // Если задана ссылка перехода
                    if (_redirectUrl is not null)
                    {
                        context.Result = new RedirectResult(_redirectUrl);
                        return;
                    }
                    else
                    {
                        context.Result = new OkObjectResult(ResponseFactory.CreateResponse(new Exception("Данный метод недоступен пользователю с текущей ролью")));
                        return;
                    }
                }
            }

            await next();
        }
    }
}
