using ExamManager.Models;
using System.Security.Claims;

namespace ExamManager.Services;

public interface IUserService
{
    public Task<User> GetUser(Guid userId, bool includeGroup = false, bool includeTasks = false);
    public Task<User> GetUser(string login, string password, bool includeGroup = false, bool includeTasks = false);
    public Task<ClaimsPrincipal> CreateUserPrincipal(User user);
    public Task<IEnumerable<User>> GetUsers(Func<User, bool> predicate, bool includeGroup = false, bool includeTasks = false);

    /// <summary>
    /// Меняет значения свойств пользователя по его ObjectID
    /// </summary>
    /// <param name="userId">ObjectID пользователя</param>
    /// <param name="data">Массив свойств, которые необходимо изменить</param>
    /// <returns></returns>
    public Task<ValidationResult> ChangeUserData(Guid userId, params Property[] data);

    public Task<User> RegisterUser(User user);
    public Task<List<User>> RegisterUsers(List<User> users);
    public Task DeleteUser(Guid userId);
    public Task DeleteUsers(HashSet<Guid> userIds);
}
