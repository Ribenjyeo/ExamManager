using ExamManager.DAO;
using ExamManager.Extensions;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
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
            result = await ValidateRegisterUserLogin(userId, tempUser);
        }

        if (!result.HasErrors)
        {
            user = entityManager.CopyInto(user).AllPropertiesFrom(tempUser).GetResult();

            await _dbContext.SaveChangesAsync();
        }

        return result;

        async Task<ValidationResult> ValidateRegisterUserLogin(Guid userId, User userValidation)
        {
            if (await UserSet.AnyAsync(user => user.Login.Equals(userValidation.GetLogin()) && !user.ObjectID.Equals(userValidation.GetObjectID())))
            {
                result.AddMessage(nameof(User.Login), "Пользователь с таким логином уже существует");
            }

            return result;
        }
    }

    private void CopyFields(User source, User target)
    {
        var userType = typeof(User);
        foreach (var property in userType.GetProperties())
        {
            property.SetValue(target, property.GetValue(source));
        }
    }

    public async Task<IEnumerable<User>> GetUsers(UserOptions options, bool includeGroup = false, bool includeTasks = false)
    {
        var UserSet = _dbContext.Set<User>();

        var query = $"SELECT * FROM `Users`";
        var conditions = GetQueryConditions(options);
        if (!string.IsNullOrEmpty(conditions))
        {
            query = query + " " + conditions;
        }

        var userIds = await UserSet.FromSqlRaw(query).Select(user => user.ObjectID).ToListAsync();

        IQueryable<User> request = UserSet.AsNoTracking().AsQueryable();
        if (includeGroup)
        {
            request = request.Include(nameof(User.StudentGroup));
        }
        if (includeTasks)
        {
            request = request.Include(nameof(User.Tasks));
        }

        var result = await request.Where(user => userIds.Contains(user.ObjectID)).ToListAsync();

        return result;
    }

    public async Task<User> RegisterUser(User user)
    {
        var UserSet = _dbContext.Set<User>();
        await UserSet.AddAsync(user);

        await _dbContext.SaveChangesAsync();

        return user;
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

    public async Task<IEnumerable<User>> GetUsers(IEnumerable<Guid> userIds, bool includeGroup = false, bool includeTasks = false)
    {
        var UserSet = _dbContext.Set<User>();

        var users = UserSet.AsQueryable().Where(user => userIds.Contains(user.ObjectID));

        return users.AsEnumerable();
    }

    private string GetQueryConditions(UserOptions options)
    {
        var conditions = new List<string>(5);

        if (options.Name is not null)
        {
            var nameParts = options.Name.Split(" ").Select(part => $"(LOWER(`FirstName`) like \"%{part.ToLower()}%\" OR LOWER(`LastName`) like \"%{part.ToLower()}%\")");
            conditions.Add(String.Join(" AND ", nameParts));
        }
        else
        {
            if (options.FirstName is not null)
            {
                conditions.Add($"LOWER(`FirstName`) like \"%{options.FirstName.ToLower()}%\"");
            }
            if (options.LastName is not null)
            {
                conditions.Add($"LOWER(`LastName`) like \"%{options.LastName.ToLower()}%\"");
            }
        }
        if (options.Role is not null)
        {
            conditions.Add($"`Role` = {(int)options.Role}");
        }
        if (options.WithoutGroups is not null)
        {
            conditions.Add($"`{nameof(User.StudentGroupID)}` IS NULL");
        }
        else
        {
            if (options.GroupIds is not null)
            {
                conditions.Add($"`{nameof(User.StudentGroupID)}` IN (\"{string.Join("\", \"", options.GroupIds)}\")");
            }
            if (options.ExcludeGroupIds is not null)
            {
                conditions.Add($"(`{nameof(User.StudentGroupID)}` NOT IN (\"{string.Join("\", \"", options.ExcludeGroupIds)}\") OR `{nameof(User.StudentGroupID)}` IS NULL)");
            }
        }
        if (options.TaskStatus is not null)
        {
            conditions.Add($"EXISTS (SELECT 1 FROM `StudentTasks` AS t WHERE t.{nameof(StudentTask.StudentID)} = ObjectID AND t.{nameof(StudentTask.Status)} = {(int)options.TaskStatus})");
        }

        if (conditions.Count > 0)
        {
            return $"WHERE {string.Join(" AND ", conditions)}";
        }

        return string.Empty;
    }

    public async Task<ValidationResult> ValidateUser(User user)
    {
        var validationResult = new ValidationResult();
        var UserSet = _dbContext.Set<User>();

        if (await UserSet.AnyAsync(u => u.Login == user.Login))
        {
            validationResult.AddMessage("login", "Пользователь с таким логином уже существует");
        }
        if (string.IsNullOrEmpty(user.FirstName))
        {
            validationResult.AddMessage("firstname", "Введите имя");
        }
        if (string.IsNullOrEmpty(user.LastName))
        {
            validationResult.AddMessage("firstname", "Введите фамилию");
        }

        return validationResult;
    }

    public async Task RegisterUsers(IEnumerable<User> users)
    {
        var UserSet = _dbContext.Set<User>();
        var existsUserLogins = new List<string>();

        foreach (var user in users)
        {
            if (await UserSet.AnyAsync(u => u.Login == user.Login))
            {
                existsUserLogins.Add(user.Login);
            }
        }

        if (existsUserLogins.Count > 0)
        {
            throw new InvalidDataException($"Пользователи с логинами {string.Join(", ", existsUserLogins)} уже существуют");
        }

        var transaction = await _dbContext.Database.BeginTransactionAsync();        
        try
        {
            await UserSet.AddRangeAsync(users);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
        await transaction.CommitAsync();
        await _dbContext.SaveChangesAsync();
    }
}
