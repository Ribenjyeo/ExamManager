using ExamManager.DAO;
using ExamManager.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace ExamManager.Services;


public class StudyTaskService : IStudyTaskService
{
    ExamManagerDBContext _dbContext;
    IVirtualMachineService _vMachineService;
    INotificationService _notificationService;

    public StudyTaskService(
        ExamManagerDBContext context, IVirtualMachineService vMachineService, INotificationService notificationService)
    {
        _dbContext = context;
        _vMachineService = vMachineService;
        _notificationService = notificationService;
    }

    public async Task<StudyTask> CreateStudyTaskAsync(string? title, string description, VirtualMachineImage[]? virtualMachines)
    {
        var transaction = await _dbContext.Database.BeginTransactionAsync();

        StudyTask task;
        try
        {
            var random = new Random();
            task = new StudyTask
            {
                Title = title,
                Description = description,
                Number = (ushort)random.Next(100, 100_000)
            };

            await _dbContext.Tasks!.AddAsync(task);

            if (virtualMachines is not null)
            {
                foreach (var vMachine in virtualMachines)
                {
                    vMachine.Task = task;
                }

                await _dbContext.VMImages!.AddRangeAsync(virtualMachines);
            }
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new InvalidDataException($"Не удалось создать задание {title}", ex);
        }

        await transaction.CommitAsync();
        await _dbContext.SaveChangesAsync();

        return task;
    }
    public async Task CreateStudyTaskAsync(StudyTask task)
    {
        await _dbContext.Tasks.AddAsync(task);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteStudyTaskAsync(Guid taskId)
    {
        var task = await _dbContext.Tasks.FirstOrDefaultAsync(task => task.ObjectID == taskId);

        if (task is null)
        {
            throw new InvalidDataException($"Задание {taskId} не существует");
        }

        var personalTasks = await _dbContext.UserTasks.Where(pTask => pTask.TaskID == task.ObjectID)?.ToListAsync();

        // Если некоторым пользователям присвоены задание, то не удаляем его
        if ((personalTasks?.Count ?? 0) > 0)
        {
            throw new InvalidDataException($"Невозможно удалить задание {task.Number}, поскольку оно присвоено студентам ({personalTasks.Count})");
        }

        _dbContext.Tasks.Remove(task ?? throw new InvalidDataException($"Задания {taskId} не существует"));
        await _dbContext.SaveChangesAsync();
    }

    public async Task<StudyTask> GetStudyTaskAsync(Guid taskId)
    {
        var task = await _dbContext.Tasks
            .AsNoTracking()
            .Include(task => task.VirtualMachines)
            .Include(task => task.PersonalTasks)!
            .ThenInclude(pTask => pTask.Student)
            .FirstOrDefaultAsync(task => task.ObjectID == taskId);

        return task ?? throw new InvalidDataException($"Задания {taskId} не существует");
    }

    public async Task<IEnumerable<StudyTask>> GetStudyTasksAsync(params Guid[] taskIds)
    {
        var tasks = await _dbContext.Tasks
            .Where(task => taskIds.Contains(task.ObjectID))
            .ToListAsync();

        return tasks;
    }

    public async Task<IEnumerable<StudyTask>> GetStudyTasksAsync(StudyTaskOptions options)
    {
        var query = $"SELECT * FROM {nameof(ExamManagerDBContext.Tasks)} t ";
        var conditions = GetQueryConditions(options);

        query += conditions;
        var temp = _dbContext.Tasks.FromSqlRaw(query);
        var tasks = await _dbContext.Tasks
            .FromSqlRaw(query)
            .AsNoTracking()
            .ToListAsync();

        return tasks;
    }

    public async Task<IEnumerable<PersonalTask>> GetPersonalTasksAsync(params Guid[] studentIds)
    {
        var personalTasks = await _dbContext.UserTasks
            .Include(pTask => pTask.Task)
            .ThenInclude(task => task.VirtualMachines)
            .Include(pTask => pTask.VirtualMachines)
            .Where(pTask => studentIds.Contains(pTask.StudentID))
            .ToListAsync();

        return personalTasks;
    }

    public async Task<StudyTask> ModifyTaskAsync(Guid taskId, StudyTask newTask)
    {
        var currentTask = await _dbContext.Tasks!.FirstOrDefaultAsync(task => task.ObjectID == taskId);

        if (currentTask is null)
        {
            throw new InvalidDataException($"Задания {taskId} не существует");
        }

        var vMachines = newTask.VirtualMachines;
        newTask.VirtualMachines = null;

        var entityManager = new EntityManager();
        entityManager
            .Modify(currentTask)
            .Except(nameof(StudyTask.ObjectID))
            .BasedOn(newTask);

        var taskVMachines = _dbContext.VMImages!.Where(vm => vm.TaskID == currentTask.ObjectID).ToList();
        foreach (var vMachine in vMachines ?? new List<VirtualMachineImage>())
        {
            var existedVMachine = taskVMachines.FirstOrDefault(vm => vm.ID == vMachine.ID);

            if (existedVMachine is null)
            {
                await _dbContext.VMImages!.AddAsync(vMachine);
                vMachine.TaskID = currentTask.ObjectID;
            }
            else
            {
                taskVMachines.Remove(existedVMachine);
            }
        }
        foreach (var vMachine in taskVMachines)
        {
            _dbContext.VMImages?.Remove(vMachine);
        }

        await _dbContext.SaveChangesAsync();

        return currentTask;
    }

    public async Task<PersonalTask> AssignTaskToStudentAsync(Guid taskId, Guid studentId)
    {
        var existedTask = await _dbContext.UserTasks
            .Include(nameof(PersonalTask.Task))
            .Include(nameof(PersonalTask.Student))
            .FirstOrDefaultAsync(task => task.TaskID == taskId && task.StudentID == studentId);

        if (existedTask is not null)
        {
            throw new Exception($"Задание '{existedTask.Task.Title}' уже привязано к пользователю {existedTask.Student.FirstName}");
        }

        var personalTask = new PersonalTask
        {
            StudentID = studentId,
            TaskID = taskId,
            Status = Models.TaskStatus.FAILED
        };

        await _dbContext.UserTasks.AddAsync(personalTask);
        await _dbContext.SaveChangesAsync();

        return personalTask;
    }

    public async Task<IEnumerable<PersonalTask>> AssignTasksToStudentAsync(Guid[] taskIds, Guid studentId)
    {
        var existedTasks = await _dbContext.UserTasks!
            .Include(nameof(PersonalTask.Task))
            .Include(nameof(PersonalTask.Student))
            .Where(task => taskIds.Contains(task.TaskID) && task.StudentID == studentId)
            .ToListAsync();

        if (existedTasks is not null && existedTasks.Count() > 0)
        {
            throw new Exception($"Задания '{string.Join("', '", existedTasks.Select(task => task.Task.Title))}' уже привязаны к пользователю {existedTasks.First().Student.FirstName}");
        }

        var personalTasks = taskIds.Select(id => new PersonalTask
        {
            StudentID = studentId,
            TaskID = id,
            Status = Models.TaskStatus.FAILED
        });

        await _dbContext.UserTasks!.AddRangeAsync(personalTasks);
        await _dbContext.SaveChangesAsync();

        return personalTasks;
    }

    public async Task WithdrawTaskFromStudentAsync(Guid personalTaskId)
    {
        var personalTask = await _dbContext.UserTasks!.FirstOrDefaultAsync(pTask => pTask.ObjectID == personalTaskId);

        if (personalTask is null)
        {
            throw new InvalidDataException($"Не удалось найти индивидуальное задание {personalTaskId}");
        }

        if (personalTask.Status == Models.TaskStatus.SUCCESSED)
        {
            throw new InvalidDataException($"Задание {personalTask.Task?.Number.ToString() ?? personalTaskId.ToString()} нельзя удалить у студента {personalTask.Student.FirstName}, поскольку оно выполнено");
        }

        _dbContext.Remove(personalTask);
        await _dbContext.SaveChangesAsync();
    }

    public async Task WithdrawTasksFromStudentAsync(Guid[] personalTaskIds)
    {
        var personalTasks = await _dbContext.UserTasks!
            .Where(pTask => personalTaskIds.Contains(pTask.ObjectID))
            .ToListAsync();

        if (personalTasks is null || personalTasks.Count() == 0)
        {
            throw new InvalidDataException($"Не удалось найти индивидуальные задания {string.Join(", ", personalTaskIds)}");
        }

        personalTasks = personalTasks.Where(pTask => pTask.Status != Models.TaskStatus.SUCCESSED).ToList();

        _dbContext.RemoveRange(personalTasks);
        await _dbContext.SaveChangesAsync();
    }

    public async Task CheckStudyTaskAsync(string vMachineId, string vmImageId, Guid pTaskId)
    {
        await _vMachineService.CheckVirtualMachine(vMachineId, vmImageId, pTaskId);
    }

    public async Task<string> StartTaskVirtualMachine(string vmImageId, Guid personalTaskId, Guid ownerId)
    {
        // Проверить наличие включенных виртуальных машин на других заданиях
        // TODO

        // Отправляем команду на запуск виртуальной машины
        var virtualMachine = await _vMachineService.StartVirtualMachine(vmImageId, ownerId, personalTaskId);

        // Отправить уведомление пользователю
        // TODO

        if (virtualMachine is null)
        {
            throw new InvalidDataException($"Не удалось запустить виртуальную машину {vmImageId}");
        }

        return virtualMachine.Name;
    }

    public async Task StopTaskVirtualMachine(string vMachineId)
    {
        try
        {
            await _vMachineService.StopVirtualMachine(vMachineId);
        }
        catch
        {
            throw;
        }
    }

    private string GetQueryConditions(StudyTaskOptions options)
    {
        var conditions = new List<string>(5);

        #region CREATE_CONDITIONS

        if (options.Title is not null && options.Number is not null)
        {
            conditions.Add($"LOWER({nameof(StudyTask.Title)}) LIKE '%{options.Title.ToLower()}%' OR CAST({nameof(StudyTask.Number)} AS VARCHAR(10)) like '%{options.Number}%'");
        }
        else
        {
            if (options.Title is not null)
            {
                conditions.Add($"LOWER({nameof(StudyTask.Title)}) LIKE '%{options.Title.ToLower()}%'");
            }
            if (options.Number is not null)
            {
                conditions.Add($"CAST({nameof(StudyTask.Number)} AS VARCHAR(10)) like '%{options.Number}%'");
            }
        }
        if (options.StudentIds is not null)
        {
            conditions.Add($"EXISTS (SELECT 1 FROM {nameof(ExamManagerDBContext.UserTasks)} WHERE {nameof(PersonalTask.TaskID)} = t.ObjectID AND {nameof(PersonalTask.StudentID)} IN ('{string.Join("', '", options.StudentIds)}))'");
        }

        #endregion

        if (conditions.Count > 0)
        {
            return ($"WHERE {string.Join(" AND ", conditions)}");
        }

        return string.Empty;
    }

    public async Task WithdrawTaskFromStudentAsync(Guid taskId, Guid studentId)
    {
        var personalTask = await _dbContext.UserTasks!
            .Include(pTask => pTask.Task)
            .FirstOrDefaultAsync(pTask => pTask.TaskID == taskId && pTask.StudentID == studentId);

        if (personalTask is null)
        {
            var taskNumber = (await _dbContext.Tasks!.FirstOrDefaultAsync(task => task.ObjectID == taskId))?.Number;
            var studentName = (await _dbContext.Users!.FirstOrDefaultAsync(user => user.ObjectID == studentId))?.FirstName;

            if (taskNumber is null)
            {
                throw new InvalidDataException($"Не удалось найти задание {taskId}");
            }
            if (studentName is null)
            {
                throw new InvalidDataException($"Не удалось найти пользователя {studentId}");
            }

            throw new InvalidDataException($"Не удалось найти задание {taskNumber} у пользователя {studentName}");
        }

        if (personalTask.Status == Models.TaskStatus.SUCCESSED)
        {
            throw new InvalidDataException($"Задание {personalTask.Task?.Number.ToString()} нельзя удалить у студента {personalTask.Student.FirstName}, поскольку оно выполнено");
        }

        _dbContext.Remove(personalTask);
        await _dbContext.SaveChangesAsync();
    }

    public async Task WithdrawTasksFromStudentAsync(Guid[] taskId, Guid studentId)
    {
        var personalTasks = await _dbContext.UserTasks!
            .Where(pTask => taskId.Contains(pTask.TaskID) && pTask.StudentID == studentId)
            .ToListAsync();

        if (personalTasks is null || personalTasks.Count() == 0)
        {
            throw new InvalidDataException($"Не удалось найти задания {string.Join(", ", taskId)} у пользователя {studentId}");
        }

        personalTasks = personalTasks.Where(pTask => pTask.Status != Models.TaskStatus.SUCCESSED).ToList();

        _dbContext.RemoveRange(personalTasks);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<VirtualMachine>?> GetPersonalTaskVirtualMachinesAsync(Guid taskId)
    {
        var pTask = await _dbContext.UserTasks!
            .AsNoTracking()
            .Include(pTask => pTask.VirtualMachines)
            .FirstOrDefaultAsync(pTask => pTask.ObjectID == taskId);

        if (pTask is null)
        {
            throw new DataNotFoundException<PersonalTask>();
        }

        var vMachines = pTask.VirtualMachines;

        if (vMachines is null || vMachines.Count == 0)
        {
            throw new DataNotFoundException<VirtualMachine>();
        }

        return vMachines;
    }

    public async Task<IEnumerable<Guid>> GetStudentsHavingTask(Guid taskId)
    {
        var studentIds = await _dbContext.UserTasks!
            .Where(pTask => pTask.TaskID == taskId)
            .Select(pTask => pTask.StudentID)
            .ToListAsync();

        return studentIds;
    }

    public async Task<PersonalTask> GetPersonalTaskAsync(Guid taskId)
    {
        var personalTask = await _dbContext.UserTasks!
            .Include(pTask => pTask.Task)
            .ThenInclude(task => task.VirtualMachines)
            .Include(pTask => pTask.VirtualMachines)
            .FirstOrDefaultAsync(pTask => pTask.ObjectID == taskId);

        return personalTask;
    }
}