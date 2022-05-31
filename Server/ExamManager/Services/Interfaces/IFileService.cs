using ExamManager.Models;

namespace ExamManager.Services;


public interface IFileService
{
    public Task<IEnumerable<User>> ParseUsersFromFile(IFormFile file, CancellationToken cancellationToken);
}