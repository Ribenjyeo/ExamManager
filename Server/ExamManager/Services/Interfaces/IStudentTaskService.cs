using ExamManager.Models;

namespace ExamManager.Services;

public interface IStudentTaskService
{
    public Task<StudentTask> GetStudentTask(Guid taskId);
    public Task<IEnumerable<StudentTask>> GetStudentTasks(Guid studentId);
    public Task<StudentTask> CreateStudentTask(StudentTask task);
    public Task<StudentTask> CreateStudentTask(string title, string? description, string url, Guid authorId, Guid studentId);
    public Task<StudentTask> ChangeTaskStatus(Guid taskId, StudentTask.TaskStatus status);
    public Task<StudentTask> ChangeTaskAuthor(Guid taskId, Guid authorId);
    public Task<StudentTask> ChangeTaskStudent(Guid taskId, Guid studentId);
    public Task<StudentTask> ChangeStudentTask(Guid taskId, string? title, string? description, string? url);
    public Task DeleteStudentTask(Guid taskId);
}