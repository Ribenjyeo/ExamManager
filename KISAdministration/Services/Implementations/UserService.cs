using KISAdministration.Extensions;
using KISAdministration.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KISAdministration.Services;

public class UserService : IUserService
{
    DbContext DbContext { get; init; }
    ISecurityService _securityService { get; init; }

    public UserService(DbContext dbContext,
        [FromServices] ISecurityService securityService)
    {
        DbContext = dbContext;
        _securityService = securityService;
    }

    public async Task<ClaimsPrincipal?> CreateUserPrincipal(User user)
    {
        if (user is null)
            return null;

        var claims = new Claim[]
        {
            new Claim(ClaimKey.Login, user.Login),
            new Claim(ClaimKey.Role, user.Role.ToString()),
            new Claim(ClaimKey.Id, user.ObjectID.ToString())
        };

        // Создаем объект ClaimsIdentity
        var claimId = new ClaimsIdentity(claims, "AppCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

        return await Task.FromResult(new ClaimsPrincipal(claimId));
    }

    public async Task<User?> GetUser(Guid userId)
    {
        var UserSet = DbContext.Set<User>();

        var user = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == userId);

        return user;
    }

    public async Task<User> GetUser(string login, string password)
    {
        var UserSet = DbContext.Set<User>();
        var passwordHash = _securityService.Encrypt(password);

        var user = await UserSet.FirstOrDefaultAsync(user => user.Login == login && user.PasswordHash.Equals(passwordHash));

        return user;
    }

    public async Task<User?> ChangeUserData(Guid userId, params (string Name, object Value)[] fieldsToChange)
    {
        var UserSet = DbContext.Set<User>();
        var user = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == userId);

        if (user is null)
        {
            return null;
        }

        var userType = typeof(User);
        foreach (var field in fieldsToChange)
        {
            userType.GetProperty(field.Name)!.SetValue(user, field.Value);
        }

        UserSet.Update(user);
        await DbContext.SaveChangesAsync();

        return user;
    }
}
