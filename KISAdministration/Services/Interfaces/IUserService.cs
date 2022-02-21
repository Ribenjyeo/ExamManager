using KISAdministration.Models;
using System.Security.Claims;

namespace KISAdministration.Services;

public interface IUserService
{
    public Task<User> GetUser(Guid userId);
    public Task<User> GetUser(string login, string password);
    public Task<ClaimsPrincipal> CreateUserPrincipal(User user);
    public Task<User?> ChangeUserData(Guid userId, params (string Name, object Value)[] fieldsToChang);
}
