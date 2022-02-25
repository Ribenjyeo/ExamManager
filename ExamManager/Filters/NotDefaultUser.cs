using ExamManager.Extensions;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace ExamManager.Filters
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
            var r = new RedirectToActionResult("", "", null);

            if (currentUser.IsDefault)
            {
                var result = new RedirectToActionResult(_redirectAction, _redirectController, null);
                var routeValueDic = new RouteValueDictionary();
                for (int i = 0; i < (_routeValues?.Length ?? 0); i+=2)
                {
                    routeValueDic.Add( (string)_routeValues[i], _routeValues[i + 1] );
                }

                result.RouteValues = routeValueDic;
                context.Result = result;
                return;
            }

            await next();
        }
    }
}
