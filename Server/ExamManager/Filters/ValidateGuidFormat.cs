using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ATMApplication.Filters
{
    public class ValidateGuidFormatAttribute : Attribute, IAsyncActionFilter
    {
        IEnumerable<string> Ids { get; set; }
        public ValidateGuidFormatAttribute()
        {
            Ids = null;
        }
        public ValidateGuidFormatAttribute(params string[] ids)
        {
            Ids = ids;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (Ids is null)
                Ids = context.ActionArguments.Keys.Where(key => key.ToLower().Contains("id"));

            foreach (var id in Ids)
            {
                if (!Guid.TryParse((string)context.ActionArguments[id], out _))
                {
                    context.Result = new BadRequestResult();
                    return;
                }
            }

            await next();
        }
    }
}
