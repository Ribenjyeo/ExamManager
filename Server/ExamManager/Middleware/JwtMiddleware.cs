using ExamManager.Extensions;
using ExamManager.Services;
using Microsoft.AspNetCore.Http;

namespace ExamManager.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, 
                                 IUserService userService,
                                 IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last() ?? 
                context.Request.Cookies["token"];
            var principal = jwtUtils.ValidateToken(token);

            if (principal is not null)
            {
                try
                {
                    var userId = Guid.Parse(principal.GetClaim(ClaimKey.Id));
                    context.Items["User"] = await userService.GetUser(userId);
                }
                catch { }
            }

            await _next(context);
        }
    }
}
