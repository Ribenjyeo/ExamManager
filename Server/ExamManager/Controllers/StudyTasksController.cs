using ATMApplication.Filters;
using ExamManager.Models;
using ExamManager.Models.RequestModels;
using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExamManager.Controllers
{
    [Route(Routes.Task)]
    public class StudyTasksController : Controller
    {
        IStudyTaskService _taskService { get; }
        IUserService _userService { get; }
        IVirtualMachineService _virtualMachineService { get; set; }

        public StudyTasksController(
            IStudyTaskService studentTaskService, IUserService userService, IVirtualMachineService virtualMachineService)
        {
            _taskService = studentTaskService;
            _userService = userService;
            _virtualMachineService = virtualMachineService;
        }

        [HttpGet(Routes.GetTask)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetTask(string id)
        {
            var taskId = Guid.Parse(id);
            var studentTask = await _taskService.GetStudyTaskAsync(taskId);

            return Ok(ResponseFactory.CreateResponse(studentTask));
        }

        [HttpPost(Routes.GetTasks)]
        public async Task<IActionResult> GetTasks([FromBody] GetTasksRequest request)
        {
            var options = RequestMapper.MapFrom(request);
            var tasks = await _taskService.GetStudyTasksAsync(options);

            return Ok(ResponseFactory.CreateResponse(tasks));
        }

        [HttpPost(Routes.CreateTask)]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
        {
            var studyTask = RequestMapper.MapFrom(request);
            try
            {
                studyTask = await _taskService.CreateStudyTaskAsync(studyTask.Title, studyTask.Description!, studyTask.VirtualMachines!.ToArray());

                return Ok(ResponseFactory.CreateResponse(studyTask));
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

        }

        [HttpPost(Routes.DeleteTask)]
        public async Task<IActionResult> DeleteTask([FromBody] DeleteTaskRequest request)
        {
            await _taskService.DeleteStudyTaskAsync(request.taskId);

            return Ok(ResponseFactory.CreateResponse());
        }

        [HttpPost(Routes.ModifyTask)]
        public async Task<IActionResult> ModifyTask([FromBody] ModifyTaskRequest request)
        {
            var studyTask = new StudyTask
            {
                Title = request.title,
                Description = request.description                
            };

            var studentTask = await _taskService.ModifyTaskAsync(request.taskId, studyTask);
            return Ok(ResponseFactory.CreateResponse(studentTask));
        }

        [HttpGet(Routes.StartTask)]
        [ValidateGuidFormat("taskId")]
        public async Task<IActionResult> StartTask(string taskId, string id)
        {
            var currentUserID = ((User)HttpContext.Items["User"]).ObjectID;
            var currentTaskId = Guid.Parse(taskId);

            var vmId = string.Empty;
            try
            {
                await _taskService.StartTaskVirtualMachine(id, currentTaskId, currentUserID);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            return Ok(ResponseFactory.CreateResponse());
        }

        [HttpGet(Routes.StopTask)]
        [ValidateGuidFormat("taskId")]
        public async Task<IActionResult> StopTask(string taskId, string id)
        {
            try
            {
                await _taskService.StopTaskVirtualMachine(id);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            return Ok(ResponseFactory.CreateResponse());
        }

        [HttpGet(Routes.CheckTask)]
        [ValidateGuidFormat("taskId")]
        public async Task<IActionResult> CheckTak(string taskId)
        {            
            await _taskService.CheckStudyTaskAsync(Guid.Parse(taskId));

            return Ok(ResponseFactory.CreateResponse());
        }

        [HttpGet(Routes.ConnectVirtualMachine)]
        [ValidateGuidFormat("taskId")]
        public async Task<IActionResult> ConnectVirtualMachine(string taskId, string id)
        {
            var vMachine = await _virtualMachineService.GetVirtualMachine(id);
            if (vMachine is null)
            {
                return Ok(ResponseFactory.CreateResponse(new InvalidDataException($"Виртуальной машины {id} не существует")));
            }

            var fileText = await _virtualMachineService.GenerateConnectionFile(vMachine);

            using var stream = new MemoryStream();
            using var writer = new StreamWriter(stream);
            writer.Write(fileText);
            writer.Flush();
            stream.Position = 0;

            return File(stream, "text/plain", "connection.vnc");
        }
    
    }
}
