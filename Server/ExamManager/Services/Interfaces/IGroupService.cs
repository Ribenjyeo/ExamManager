using ExamManager.Models;

namespace ExamManager.Services;

public interface IGroupService
{
    public Task<Group?> GetGroup (string groupName);
    public Task<Group?> GetGroup(Guid groupId);

    public Task<Group?> CreateGroup(string name);
    public Task AddStudent(Guid groupId, Guid studentId);
    public Task RemoveStudent(Guid groupId, Guid studentId);
}