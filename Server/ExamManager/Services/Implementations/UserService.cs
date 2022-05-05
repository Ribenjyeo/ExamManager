using ExamManager.Extensions;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace ExamManager.Services;

public class UserService : IUserService
{
    DbContext _dbContext { get; init; }
    ISecurityService _securityService { get; init; }

    public UserService(DbContext dbContext,
        [FromServices] ISecurityService securityService)
    {
        _dbContext = dbContext;
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

    public async Task<User?> GetUser(Guid userId, bool includeGroup = false, bool includeTasks = false)
    {
        var UserSet = _dbContext.Set<User>();

        var query = UserSet.AsNoTracking();
        if (includeGroup)
        {
            query = query.Include(u => u.StudentGroup);
        }
        if (includeTasks)
        {
            query = query.Include(u => u.Tasks);
        }
        var user = await query.FirstOrDefaultAsync(user => user.ObjectID == userId);

        return user;
    }

    public async Task<User> GetUser(string login, string password, bool includeGroup = false, bool includeTasks = false)
    {
        var UserSet = _dbContext.Set<User>();
        var passwordHash = _securityService.Encrypt(password);

        var query = UserSet.AsNoTracking();
        if (includeGroup)
        {
            query = query.Include(u => u.StudentGroup);
        }
        if (includeTasks)
        {
            query = query.Include(u => u.Tasks);
        }
        var user = await query.FirstOrDefaultAsync(user => user.Login == login && user.PasswordHash.Equals(passwordHash));

        return user;
    }

    public async Task<ValidationResult> ChangeUserData(Guid userId, params Property[] data)
    {
        var UserSet = _dbContext.Set<User>();
        var user = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == userId);
        var result = new ValidationResult();

        if (user is null)
        {
            result.AddCommonMessage("Пользователь не найден");
            return result;
        }

        var entityManager = new EntityManager();
        // Создаем временного пользователя и копируем значения свойств из user
        var tempUser = new User();
        tempUser = entityManager.CopyInto(tempUser).AllPropertiesFrom(user).GetResult();

        // Для изменяемых свойств временного пользователя присваиваем переданные значения
        var userCopyManager = entityManager.CopyInto(tempUser);
        foreach (var prop in data)
        {
            userCopyManager.Property(prop.Name, prop.Value);
        }
        tempUser = userCopyManager.GetResult();

        // Если в изменяемых параметрах присутствует логин
        if (data?.Select(field => field.Name).Contains(nameof(Models.User.Login)) ?? false)
        {
            result = await ValidateRegisterUserLogin(tempUser);
        }

        if (!result.HasErrors)
        {
            user = entityManager.CopyInto(user).AllPropertiesFrom(tempUser).GetResult();

            await _dbContext.SaveChangesAsync();
        }

        return result;

        async Task<ValidationResult> ValidateRegisterUserLogin(User userValidation)
        {
            if (await UserSet.AnyAsync(user => user.Login.Equals(userValidation.GetLogin())))
            {
                result.AddMessage(nameof(User.Login), "Пользователь с таким логином уже существует");
            }

            return result;
        }
    }

    private void CopyFields(User source, User target)
    {
        var userType = typeof(User);
        foreach(var property in userType.GetProperties())
        {
            property.SetValue(target, property.GetValue(source));
        }
    }

    public async Task<IEnumerable<User>> GetUsers(Func<User, bool> predicate, bool includeGroup = false, bool includeTasks = false)
    {
        var UserSet = _dbContext.Set<User>();

        IQueryable<User> request = UserSet.AsQueryable();
        if (includeGroup)
        {
            request = request.Include(nameof(User.StudentGroup));
        }
        if (includeTasks)
        {
            request = request.Include(nameof(User.Tasks));
        }

        return request.Where(predicate);
    }

    public async Task<User> RegisterUser(User user)
    {
        var UserSet = _dbContext.Set<User>();
        await UserSet.AddAsync(user);

        await _dbContext.SaveChangesAsync();

        return user;
    }

    public async Task<List<User>> RegisterUsers(List<User> users)
    {
        var UserSet = _dbContext.Set<User>();
        await UserSet.AddRangeAsync(users);

        await _dbContext.SaveChangesAsync();

        return users;
    }

    public async Task DeleteUser(Guid userId)
    {
        var UserSet = _dbContext.Set<User>();
        var user = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == userId);
        if (user is not null)
        {
            UserSet.Remove(user);
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteUsers(HashSet<Guid> userIds)
    {
        var UserSet = _dbContext.Set<User>();
        var users = UserSet.Where(user => userIds.Contains(user.ObjectID));

        if (users.Count() > 0)
        {
            UserSet.RemoveRange(users);
        }

        await _dbContext.SaveChangesAsync();
    }
}
