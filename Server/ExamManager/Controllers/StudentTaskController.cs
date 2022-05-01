using ATMApplication.Filters;
using ExamManager.Models;
using ExamManager.Models.RequestModels;
using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExamManager.Controllers
{
    [Route(Routes.Task)]
    public class StudentTaskController : Controller
    {
        IStudentTaskService _studentTaskService { get; }
        IUserService _userService { get; }

        public StudentTaskController(
            IStudentTaskService studentTaskService, 
            IUserService userService
            )
        {
            _studentTaskService = studentTaskService;
            _userService = userService;
        }

        [HttpGet(Routes.GetTask)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetTask(string id)
        {
            var taskId = Guid.Parse(id);
            var studentTask = await _studentTaskService.GetStudentTask(taskId);

            return Ok(ResponseFactory.CreateResponse(studentTask));
        }

        [HttpPost(Routes.CreateTask)]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
        {
            var authorId = request.authorId;
            if (authorId is null)
            {
                authorId = ((User)HttpContext.Items["User"]).ObjectID;
            }

            var studentTask = await _studentTaskService.CreateStudentTask(request.title, request.description, request.url, authorId.Value, request.studentId);

            return Ok(ResponseFactory.CreateResponse(studentTask));
        }

        [HttpPost(Routes.DeleteTask)]
        public async Task<IActionResult> DeleteTask([FromBody] DeleteTaskRequest request)
        {
            await _studentTaskService.DeleteStudentTask(request.taskId);

            return Ok(ResponseFactory.CreateResponse());
        }

        [HttpPost(Routes.ModifyTask)]
        public async Task<IActionResult> ModifyTask([FromBody] ModifyTaskRequest request)
        {
            if (request.studentId is not null)
            {
                await _studentTaskService.ChangeTaskStudent(request.taskId, request.studentId.Value);
            }
            if (request.authorId is not null)
            {
                await _studentTaskService.ChangeTaskAuthor(request.taskId, request.authorId.Value);
            }
            if (request.status is not null)
            {
                await _studentTaskService.ChangeTaskStatus(request.taskId, request.status.Value);
            }

            var studentTask = await _studentTaskService.ChangeStudentTask(request.taskId, request.title, request.description, request.url);
            return Ok(ResponseFactory.CreateResponse(studentTask));
        }
    }
}
