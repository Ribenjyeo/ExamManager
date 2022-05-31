using ExamManager.Models;

namespace ExamManager.Services;

public interface IGroupService
{
    public Task<Group?> GetGroup(string groupName, bool includeStudents = false);
    public Task<Group?> GetGroup(Guid groupId, bool includeStudents = false);
    public Task DeleteGroup(Guid groupId);
    public Task<Group[]> GetGroups(GroupOptions options, bool includeStudents = false);
    public Task<Group> GetStudentGroup(Guid studentId, bool includeStudents = false);

    public Task<Group> CreateGroup(string name);
    public Task AddStudent(Guid groupId, Guid studentId);
    public Task AddStudentRange(Guid groupId, IEnumerable<Guid> studentIds);
    public Task RemoveStudent(Guid studentId);
    public Task RemoveStudentRange(IEnumerable<Guid> studentIds);
}

public struct GroupOptions
{
    public string? Name { get; set; }
    public int? MinStudentsCount { get; set; }
    public int? MaxStudentsCount { get; set; }
    public int? Count { get; set; }
}