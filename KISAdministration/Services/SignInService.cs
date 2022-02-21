using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace KISAdministration.Services;

public class SignInService
{
    public LogInClass LogIn()
    {
        return new LogInClass();
    }
    public LogOutClass LogOut()
    {
        return new LogOutClass();
    }

    public class LogInClass
    {
        public async Task WithClaims(HttpContext context, ClaimsPrincipal principal)
        {
            await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
            {
                IsPersistent = true
            });
        }
    }

    public class LogOutClass
    {
        public async Task WithClaims(HttpContext context)
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}

public static class AuthenticationExtensions
{
    public static void AddClaimsAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.IsEssential = true;
                    options.Cookie.SameSite = SameSiteMode.None;

                    options.ExpireTimeSpan = TimeSpan.FromHours(2);
                    options.SlidingExpiration = true;

                    options.LoginPath = new PathString("/login");
                    options.LogoutPath = new PathString("/logout");
                    options.AccessDeniedPath = new PathString("/home");
                });

        //services.AddAuthorizationCore(options =>
        //{
        //    options.AddPolicy("AuthenticatedOnly", policy => policy.RequireAuthenticatedUser()
        //                                                           .AddAuthenticationSchemes(CookieAuthenticationDefaults.AuthenticationScheme)
        //                                                           .Build());
        //});

        services.AddAuthorizationCore();
    }
}
