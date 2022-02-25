using ExamManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamManager.Services;

public class GroupService : IGroupService
{
    DbContext _dbContext;
    public GroupService(DbContext context)
    {
        _dbContext = context;
    }

    public async Task<Group?> GetGroup(string groupName)
    {
        var GroupSet = _dbContext.Set<Group>();

        var group = await GroupSet.AsNoTracking().FirstOrDefaultAsync(g => g.Name == groupName);

        return group;
    }

    public async Task<Group?> GetGroup(Guid groupId)
    {
        var GroupSet = _dbContext.Set<Group>();

        var group = await GroupSet.AsNoTracking().FirstOrDefaultAsync(g => g.ObjectID == groupId);

        return group;
    }

    public async Task AddStudent(Guid groupId, Guid studentId)
    {
        // Проверяем пользователя
        var studentValidationTask = new Task<(ValidationResult Result, User Student)>(() =>
        {
            var UserSet = _dbContext.Set<User>();
            var user = UserSet.FirstOrDefault(u => u.ObjectID == studentId);
            var validationResult = ValidateStudent(user);

            return (validationResult!, user!);
        });
        // Проверяем группу
        var groupValidationTask = new Task<(ValidationResult Result, Group Group)>(() =>
        {
            var GroupSet = _dbContext.Set<Group>();
            var group = GroupSet.AsNoTracking().FirstOrDefault(g => g.ObjectID == groupId);
            var validationResult = ValidateGroup(group);

            return (validationResult!, group!);
        });

        studentValidationTask.Start();
        groupValidationTask.Start();

        var studentValidation = await studentValidationTask;
        var groupValidation = await groupValidationTask;

        if (studentValidation.Result.HasErrors)
        {
            throw new Exception(studentValidation.Result.CommonMessages.First());
        }
        else if (groupValidation.Result.HasErrors)
        {
            throw new Exception(groupValidation.Result.CommonMessages.First());
        }

        var student = studentValidation.Student;
        var group = groupValidation.Group;

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

    public async Task<Group?> CreateGroup(string name)
    {
        var GroupSet = _dbContext.Set<Group>();

        if (await GroupSet.AnyAsync(g => g.Name == name))
        {
            return null;
        }

        var group = new Group
        {
            Name = name,
            Students = new List<User>()
        };

        await GroupSet.AddAsync(group);
        return group;
    }
       
}