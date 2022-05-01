using ExamManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamManager.Services;

public class GroupService : IGroupService
{
    IUserService _userService;   
    DbContext _dbContext;
    public GroupService(DbContext context, IUserService userService)
    {
        _dbContext = context;
        _userService = userService;
    }

    public async Task<Group> GetGroup(string groupName, bool includeStudents = false)
    {
        var GroupSet = _dbContext.Set<Group>();

        var query = GroupSet.AsNoTracking();
        if (includeStudents)
            query = query.Include(nameof(Group.Students));
        var group = await query.FirstOrDefaultAsync(g => g.Name == groupName);

        return group;
    }

    public async Task<Group> GetGroup(Guid groupId, bool includeStudents = false)
    {
        var GroupSet = _dbContext.Set<Group>();

        var query = GroupSet.AsNoTracking();
        if (includeStudents)
            query = query.Include(nameof(Group.Students));
        var group = await query.FirstOrDefaultAsync(g => g.ObjectID == groupId);

        return group;
    }

    public async Task AddStudent(Guid groupId, Guid studentId)
    {
        var UserSet = _dbContext.Set<User>();
        var GroupSet = _dbContext.Set<Group>();

        // Проверяем пользователя
        var student = UserSet.FirstOrDefault(u => u.ObjectID == studentId);
        (ValidationResult Result, User Student) studentValidation = (ValidateStudent(student), student);

        // Проверяем группу
        var group = GroupSet.AsNoTracking().FirstOrDefault(g => g.ObjectID == groupId);
        (ValidationResult Result, Group Group) groupValidation = (ValidateGroup(group), group);

        if (studentValidation.Result.HasErrors)
        {
            throw new Exception(studentValidation.Result.CommonMessages.First());
        }
        else if (groupValidation.Result.HasErrors)
        {
            throw new Exception(groupValidation.Result.CommonMessages.First());
        }

        student.StudentGroup = group;

        await _dbContext.SaveChangesAsync();

        #region LOCAL_FUNCTIONS

        ValidationResult ValidateStudent(User? student)
        {
            var result = new ValidationResult();

            // Проверяем, что пользователь существует
            if (student is null)
            {
                result.AddCommonMessage("Пользователь не существует");
                return result;
            }

            // Прооеряем что пользователь является студентом
            if (student is not { Role: UserRole.STUDENT })
            {
                result.AddCommonMessage("Пользователь не является студентом");
                return result;
            }

            return result;
        }

        ValidationResult ValidateGroup(Group? group)
        {
            var result = new ValidationResult();

            // Проверяем, что группа существует
            if (group is null)
            {
                result.AddCommonMessage("Группа не существует");
                return result;
            }

            return result;
        }

        #endregion
    }
    public Task RemoveStudent(Guid groupId, Guid studentId)
    {
        throw new NotImplementedException();
    }

    public async Task<Group> CreateGroup(string name)
    {
        var GroupSet = _dbContext.Set<Group>();

        if (await GroupSet.AnyAsync(g => g.Name == name))
        {
            throw new InvalidDataException($"Группа {name} уже существует");
        }

        var group = new Group
        {
            Name = name,
            Students = new List<User>()
        };

        await GroupSet.AddAsync(group);
        await _dbContext.SaveChangesAsync();

        return group;
    }

    public async Task<Group> GetStudentGroup(Guid studentId, bool includeStudents = false)
    {
        var userGroup = (await _userService.GetUser(studentId, true)).StudentGroup;

        return userGroup;
    }

    public async Task<Group[]> GetGroups(GroupOptions options, bool includeStudents = false)
    {
        var GroupSet = _dbContext.Set<Group>();
        var groups = GroupSet.AsEnumerable().Where(g =>
        {
            var studentsCount = g.Students?.Count() ?? 0;
            return (options.Name is null ? true : g.Name.Contains(options.Name, StringComparison.CurrentCultureIgnoreCase)) &&
                   (options.MinStudentsCount is null ? true : studentsCount >= options.MinStudentsCount) &&
                   (options.MaxStudentsCount is null ? true : studentsCount <= options.MaxStudentsCount);
        }).ToArray();

        return groups;
    }
}