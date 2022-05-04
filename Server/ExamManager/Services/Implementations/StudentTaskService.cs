using ExamManager.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamManager.Services;


public class StudentTaskService : IStudentTaskService
{
    DbContext _dbContext;
    IUserService _userService;
    public StudentTaskService(
        DbContext context, 
        IUserService userService
        )
    {
        _dbContext = context;
        _userService = userService;
    }

    public async Task<StudentTask> CreateStudentTask(StudentTask task)
    {
        var TaskSet = _dbContext.Set<StudentTask>();
        var studentTask = (await TaskSet.AddAsync(task)).Entity;

        return studentTask;
    }

    public async Task<StudentTask> CreateStudentTask(string title, string? description, string url, Guid authorId, Guid studentId)
    {
        var TaskSet = _dbContext.Set<StudentTask>();

        var studentTask = new StudentTask
        {
            Title = title,
            Description = description,
            Url = url,
            AuthorID = authorId,
            StudentID = studentId
        };

        await TaskSet.AddAsync(studentTask);
        await _dbContext.SaveChangesAsync();

        return studentTask;
    }

    public async Task DeleteStudentTask(Guid taskId)
    {
        var TaskSet = _dbContext.Set<StudentTask>();
        var studentTask = await GetStudentTask(taskId);

        TaskSet.Remove(studentTask);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<StudentTask> GetStudentTask(Guid taskId)
    {
        var TaskSet = _dbContext.Set<StudentTask>();
        var studentTask = await TaskSet.FirstOrDefaultAsync(t => t.ObjectID == taskId);

        if (studentTask is null)
        {
            throw new InvalidDataException($"Не удалось найти задание {taskId}");
        }

        return studentTask;
    }

    public async Task<IEnumerable<StudentTask>> GetStudentTasks(Guid studentId)
    {
        var TaskSet = _dbContext.Set<StudentTask>();
        var studentTasks = TaskSet.Where(t => t.StudentID == studentId);

        return await studentTasks.ToListAsync();
    }
    public async Task<StudentTask> ChangeTaskStatus(Guid taskId, StudentTask.TaskStatus status)
    {
        var studentTask = await GetStudentTask(taskId);

        await UpdateTask(studentTask, task => task.Status = status);

        return studentTask;
    }

    public async Task<StudentTask> ChangeTaskAuthor(Guid taskId, Guid authorId)
    {
        var studentTask = await GetStudentTask(taskId);
        var author = await _userService.GetUser(authorId);

        await UpdateTask(studentTask, task => task.Author = author);
        return studentTask;
    }

    public async Task<StudentTask> ChangeTaskStudent(Guid taskId, Guid studentId)
    {
        var studentTask = await GetStudentTask(taskId);

        await UpdateTask(studentTask, task => task.StudentID = studentId);
        return studentTask;
    }

    private async Task UpdateTask(StudentTask task, Action<StudentTask> update)
    {
        update?.Invoke(task);

        await _dbContext.SaveChangesAsync();
    }

    public async Task<StudentTask> ChangeStudentTask(Guid taskId, string? title, string? description, string? url)
    {
        var studentTask = await GetStudentTask(taskId);

        if (!string.IsNullOrEmpty(title))
        {
            studentTask.Title = title;
        }
        if (!string.IsNullOrEmpty(description))
        {
            studentTask.Description = description;
        }
        if (!string.IsNullOrEmpty(url))
        {
            studentTask.Url = url;
        }

        await _dbContext.SaveChangesAsync();
        return studentTask;
    }
}