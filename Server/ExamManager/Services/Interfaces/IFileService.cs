using ExamManager.Models;

namespace ExamManager.Services;


public interface IFileService
{
    public Task<IEnumerable<(User User, string GroupName)>> ParseUsersFromFile(IFormFile file, CancellationToken cancellationToken);
}