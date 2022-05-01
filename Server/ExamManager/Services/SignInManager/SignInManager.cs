using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace ExamManager.Services;

public class SignInManager
{
    public IServiceProvider ServiceProvider { get; set; }
    public SignInManager(IServiceProvider provider)
    {
        ServiceProvider = provider;
    }
    public LogIn LogIn()
    {
        return new LogIn(this);
    }
    public LogOut LogOut()
    {
        return new LogOut(this);
    }
}

public class LogIn
{
    private SignInManager _manager { get; set; }
    public LogIn(SignInManager manager)
    {
        _manager = manager;
    }

    public T GetService<T>()
    {
        return (T)_manager.ServiceProvider.GetService(typeof(T));
    }
}

public class LogOut
{
    private SignInManager _manager { get; set; }
    public LogOut(SignInManager manager)
    {
        _manager = manager;
    }

    public T GetService<T>()
    {
        return (T)_manager.ServiceProvider.GetService(typeof(T));
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

                    options.LoginPath = new PathString("/home");
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
