using ExamManager.Models;

namespace ExamManager.Services;


public interface IFileService
{
    public Task<IEnumerable<RegisterEditModel>> ParseExcelRegisterModels(IFormFile file, CancellationToken cancellationToken);
    public Task<IEnumerable<User>> ParseExcelUsers(IFormFile file, CancellationToken cancellationToken);
}