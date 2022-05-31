using ExamManager.Extensions;
using ExamManager.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

    public async Task<Group?> GetGroup(string groupName, bool includeStudents = false)
    {
        var GroupSet = _dbContext.Set<Group>();

        var query = GroupSet.AsNoTracking();
        if (includeStudents)
            query = query.Include(nameof(Group.Students));
        var group = await query.FirstOrDefaultAsync(g => g.Name == groupName);

        return group;
    }

    public async Task<Group?> GetGroup(Guid groupId, bool includeStudents = false)
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
    }
    public async Task RemoveStudent(Guid studentId)
    {
        var UserSet = _dbContext.Set<User>();

        var student = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == studentId);
        if (student == null)
        {
            throw new InvalidDataException($"Пользователя {studentId} не существует");
        }

        student.StudentGroupID = null;

        await _dbContext.SaveChangesAsync();
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
        IEnumerable<Group>? groups;

        if (includeStudents)
        {
            groups = GroupSet.Include(nameof(Group.Students)).AsEnumerable();
        }
        else
        {
            groups = await GroupSet.ToListAsync();
        }
        groups = groups.Where(g =>
        {
            var studentsCount = g.Students?.Count() ?? 0;
            return (options.Name is null ? true : g.Name.Contains(options.Name, StringComparison.CurrentCultureIgnoreCase)) &&
                   (options.MinStudentsCount is null ? true : studentsCount >= options.MinStudentsCount) &&
                   (options.MaxStudentsCount is null ? true : studentsCount <= options.MaxStudentsCount);
        });

        if (options.Count is not null)
        {
            groups = groups.Take(options.Count.Value);
        }

        return groups.ToArray();
    }

    public async Task DeleteGroup(Guid groupId)
    {
        var GroupSet = _dbContext.Set<Group>();
        var group = await GroupSet.FirstOrDefaultAsync(group => group.ObjectID == groupId);

        if (group is null)
        {
            throw new InvalidOperationException($"Группы {groupId} не существует");
        }

        GroupSet.Remove(group);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AddStudentRange(Guid groupId, IEnumerable<Guid> studentIds)
    {
        var UserSet = _dbContext.Set<User>();

        // Проверяем группу
        var group = await GetGroup(groupId, includeStudents: true);
        (ValidationResult Result, Group? Group) groupValidation = (ValidateGroup(group), group);

        if (groupValidation.Result.HasErrors)
        {
            throw new Exception(groupValidation.Result.CommonMessages.First());
        }

        var students = new List<User>(studentIds.Count());
        var transaction = await _dbContext.Database.BeginTransactionAsync();

        // Проверяем и добавляем пользователей
        foreach (var studentId in studentIds)
        {
            var student = UserSet.Include(nameof(User.StudentGroup)).FirstOrDefault(u => u.ObjectID == studentId);
            (ValidationResult Result, User Student) studentValidation = (ValidateStudent(student), student);

            if (studentValidation.Result.HasErrors)
            {
                await transaction.RollbackAsync();
                throw new Exception(studentValidation.Result.CommonMessages.First());
            }

            student.StudentGroup = group;
        }
        await transaction.CommitAsync();
        await _dbContext.SaveChangesAsync();
    }

    private ValidationResult ValidateStudent(User? student)
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

        // Прооеряем что пользователь не состоит в другой группе
        if (student.StudentGroup is not null)
        {
            result.AddCommonMessage($"Пользователь уже является участником группы {student.StudentGroup.Name}");
            return result;
        }

        return result;
    }

    private ValidationResult ValidateGroup(Group? group)
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

    public async Task RemoveStudentRange(IEnumerable<Guid> studentIds)
    {
        var UserSet = _dbContext.Set<User>();

        var transaction = await _dbContext.Database.BeginTransactionAsync();
        foreach (var studentId in studentIds)
        {

            var student = await UserSet.FirstOrDefaultAsync(user => user.ObjectID == studentId);
            if (student == null)
            {
                await transaction.RollbackAsync();
                throw new InvalidDataException($"Пользователя {studentId} не существует");
            }

            student.StudentGroupID = null;
        }

        await transaction.CommitAsync();
        await _dbContext.SaveChangesAsync();
    }
}