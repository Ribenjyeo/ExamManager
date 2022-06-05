using Microsoft.AspNetCore.SignalR;

namespace ExamManager.Services;
public class NotificationHub : Hub
{
    public async Task SendNotification(Guid userId, string message)
    {
        await Clients.User(userId.ToString()).SendAsync(message);
    }
}