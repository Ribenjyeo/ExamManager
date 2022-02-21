using KISAdministration.Extensions;
using KISAdministration.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace KISAdministration.Filters
{
    public class NotDefaultUserAttribute : Attribute, IAsyncActionFilter
    {
        string _redirectController { get; set; }
        string _redirectAction { get; set; }
        public NotDefaultUserAttribute(string RedirectController, 
                                       string RedirectAction)
        {
            _redirectController = RedirectController;
            _redirectAction = RedirectAction;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var dbContext = context.HttpContext.RequestServices.GetService<DbContext>()!;
            var userId = Guid.Parse(context.HttpContext.User.GetClaim(ClaimKey.Id));

            var UserSet = dbContext.Set<User>();

            var currentUser = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == userId);

            if (currentUser.IsDefault)
            {
                context.Result = new RedirectToActionResult(_redirectAction, _redirectController, null);
                return;
            }

            await next();
        }
    }
}
