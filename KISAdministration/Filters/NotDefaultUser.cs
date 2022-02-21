using KISAdministration.Extensions;
using KISAdministration.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace KISAdministration.Filters
{
    public class NotDefaultUserAttribute : Attribute, IAsyncActionFilter
    {
        string _redirectController { get; set; }
        string _redirectAction { get; set; }
        object[] _routeValues { get; set; }
        public NotDefaultUserAttribute(string RedirectController, 
                                       string RedirectAction,
                                       params object[] RouteValues)
        {
            _redirectController = RedirectController;
            _redirectAction = RedirectAction;
            _routeValues = RouteValues;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var dbContext = context.HttpContext.RequestServices.GetService<DbContext>()!;
            var userId = Guid.Parse(context.HttpContext.User.GetClaim(ClaimKey.Id));

            var UserSet = dbContext.Set<User>();

            var currentUser = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == userId);

            if (currentUser.IsDefault)
            {
                var constructorParameters = new Type[] { typeof(string), typeof(string), typeof(object) };
                var constructor = typeof(RedirectToActionResult).GetConstructor(System.Reflection.BindingFlags.Public, constructorParameters);
                
                context.Result = new RedirectToActionResult(_redirectAction, _redirectController, _routeValues);
                return;
            }

            await next();
        }
    }
}
