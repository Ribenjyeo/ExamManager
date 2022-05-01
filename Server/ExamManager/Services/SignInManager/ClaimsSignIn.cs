using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace ExamManager.Services;

public static class ClaimsSignIn
{
    public static async Task UsingClaims(this LogIn logIn, HttpContext context, ClaimsPrincipal principal)
    {
        await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
        {
            IsPersistent = true
        });
    }

    public static async Task UsingClaims(this LogOut logOut, HttpContext context)
    {
        await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    }

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
                    options.AccessDeniedPath = new PathString("/login");
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