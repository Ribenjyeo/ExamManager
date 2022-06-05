namespace ExamManager.Services;

public interface INotificationService
{
    public Task NotifyUser(Guid userId, string msg);
}
