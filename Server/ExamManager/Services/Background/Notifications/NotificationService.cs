using Microsoft.AspNetCore.SignalR;
using System.Threading.Channels;

namespace ExamManager.Services;

public class NotificationService : BackgroundService, INotificationService
{
    record Notification(Guid UserId, string Message);
    Channel<Notification> _notifications { get; set; }
    IServiceProvider _services { get; set; }

    public NotificationService(IServiceProvider services)
    {
        _services = services;

        var options = new UnboundedChannelOptions
        {
            SingleReader = true,
            AllowSynchronousContinuations = true
        };
        _notifications = Channel.CreateUnbounded<Notification>(options);
    }

    public async Task NotifyUser(Guid userId, string msg)
    {
        var newNotification = new Notification(userId, msg);
        await _notifications.Writer.WriteAsync(newNotification);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var notification = await _notifications.Reader.ReadAsync();
            using (var scope = _services.CreateScope())
            {
                var hub = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();
                
                await hub.Clients.User(notification.UserId.ToString()).SendAsync("Notify", notification.Message, stoppingToken);
            }
        }
    }
}
