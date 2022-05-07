using ExamManager.Models;
using AutoMapper;
using ExamManager.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamManager.Models.RequestModels;
using ATMApplication.Filters;
using ExamManager.Filters;

namespace ExamManager.Controllers
{

    [ApiController]
    [JwtAuthorize]
    public class GroupController : ControllerBase
    {
        IUserService _userService { get; set; }
        IMapper _mapper { get; set; }
        IGroupService _groupService { get; set; }
        public GroupController(IUserService userService,
            IMapper mapper,
            IGroupService groupService)
        {
            _userService = userService;
            _mapper = mapper;
            _groupService = groupService;
        }

        [HttpGet(Routes.GetGroup)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetGroup(string id)
        {
            var groupId = Guid.Parse(id);

            var group = await _groupService.GetGroup(groupId);

            return Ok(ResponseFactory.CreateResponse(group));
        }

        [HttpPost(Routes.GetGroups)]
        public async Task<IActionResult> GetGroups([FromBody] GetGroupsRequest request)
        {
            var options = new GroupOptions
            {
                Name = request.name,
                MinStudentsCount = request.minStudentsCount,
                MaxStudentsCount = request.maxStudentsCount,
                Count = request.count
            };

            Group[] groups = null;
            try
            {
                groups = await _groupService.GetGroups(options, includeStudents: true);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            return Ok(ResponseFactory.CreateResponse(groups));
        }

        [HttpGet(Routes.DeleteGroup)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> DeleteGroup(string id)
        {
            var groupId = Guid.Parse(id);

            try
            {
                await _groupService.DeleteGroup(groupId);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(new Exception("Не удалось удалить группу", ex)));
            }

            return Ok(ResponseFactory.CreateResponse());
        }

        [HttpPost(Routes.CreateGroup)]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var createdGroup = new Group();
            try
            {
                createdGroup = await _groupService.CreateGroup(request.name);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            return Ok(ResponseFactory.CreateResponse(createdGroup));
        }

        [HttpGet(Routes.GetGroupStudents)]
        [ValidateGuidFormat("id")]
        public async Task<IActionResult> GetGroupStudents(string id)
        {
            var groupId = Guid.Parse(id);
            var group = await _groupService.GetGroup(groupId, true);

            return Ok(ResponseFactory.CreateResponse(group.Students, group.Name));
        }

        [HttpPost(Routes.AddGroupStudents)]
        public async Task<IActionResult> AddGroupStudents([FromBody] AddStudentsRequest request)
        {
            try
            {
                await _groupService.AddStudentRange(request.groupId, request.students.Select(student => student.id));
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(ex));
            }

            var group = await _groupService.GetGroup(request.groupId, true);

            return Ok(ResponseFactory.CreateResponse(group.Students, group.Name));
        }

        [HttpPost(Routes.RemoveGroupStudents)]
        public async Task<IActionResult> RemoveGroupStudents([FromBody] RemoveStudentsRequest request)
        {
            if (request.students.Length == 0)
            {
                var exception = new InvalidDataException("В запросе не указаны пользователи");
                return Ok(ResponseFactory.CreateResponse(exception));
            }

            var studentIds = request.students.Select(student => student.id);

            try
            {
                await _groupService.RemoveStudentRange(studentIds);
            }
            catch (Exception ex)
            {
                return Ok(ResponseFactory.CreateResponse(new Exception("Не удалось удалить студентов", ex)));
            }

            var students = await _userService.GetUsers(studentIds);

            return Ok(ResponseFactory.CreateResponse(students));
        }
    }
}
