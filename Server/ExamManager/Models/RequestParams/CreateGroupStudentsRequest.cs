namespace ExamManager.Models;

public struct CreateGroupStudentsRequest
{
    public Guid GroupId { get; set; }
    public List<RegisterEditModel> Students { get; set; }
    public IFormFile File { get; set; }
}