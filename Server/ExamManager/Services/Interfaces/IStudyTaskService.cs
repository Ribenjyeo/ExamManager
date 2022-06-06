using ExamManager.Models;

namespace ExamManager.Services;

public interface IStudyTaskService
{
    #region GET

    /// <summary>
    /// Получить объект задания по его ID
    /// </summary>
    /// <param name="taskId">ID задания</param>
    public Task<StudyTask> GetStudyTaskAsync(Guid taskId);

    /// <summary>
    /// Получить коллекцию заданий по их ID
    /// </summary>
    /// <param name="taskIds">Массив ID заданий</param>
    public Task<IEnumerable<StudyTask>> GetStudyTasksAsync(params Guid[] taskIds);

    /// <summary>
    /// Получить коллекцию заданий на основе параметров
    /// </summary>
    /// <param name="options">Параметры для выборки заданий</param>
    public Task<IEnumerable<StudyTask>> GetStudyTasksAsync(StudyTaskOptions options);

    public Task<IEnumerable<PersonalTask>> GetPersonalTasksAsync(params Guid[] studentIds);

    public Task<PersonalTask> GetPersonalTaskAsync(Guid taskId);

    public Task<IEnumerable<VirtualMachine>?> GetPersonalTaskVirtualMachinesAsync(Guid taskId);

    public Task<IEnumerable<Guid>> GetStudentsHavingTask(Guid taskId);

    #endregion

    #region TRANSFORM

    public Task<StudyTask> CreateStudyTaskAsync(string? title, string description, VirtualMachineImage[]? virtualMachines);
    public Task CreateStudyTaskAsync(StudyTask task);
    public Task DeleteStudyTaskAsync(Guid taskId);

    /// <summary>
    /// Изменить значения полей сущности <see cref="StudyTask"/>
    /// </summary>
    /// <param name="newTask">Объект, значения свойств которого будут изменены у имеющегося в БД (свойства со значением null не будут изменены)</param>
    public Task<StudyTask> ModifyTaskAsync(Guid taskId, StudyTask newTask);

    #endregion

    #region ACTIONS

    public Task<PersonalTask> AssignTaskToStudentAsync(Guid taskId, Guid studentId);
    public Task<IEnumerable<PersonalTask>> AssignTasksToStudentAsync(Guid[] taskIds, Guid studentId);

    public Task WithdrawTaskFromStudentAsync(Guid personalTaskId);
    public Task WithdrawTaskFromStudentAsync(Guid taskId, Guid studentId);
    public Task WithdrawTasksFromStudentAsync(Guid[] personalTaskIds);
    public Task WithdrawTasksFromStudentAsync(Guid[] taskId, Guid studentId);

    /// <summary>
    /// Запустить виртуальную машину по ID ее образа
    /// </summary>
    /// <param name="vmImageId"></param>
    /// <param name="personalTaskId"></param>
    /// <param name="ownerId"></param>
    /// <returns>Идентификатор виртуальной машины</returns>
    public Task<string> StartTaskVirtualMachine(string vmImageId, Guid personalTaskId, Guid ownerId);
    public Task StopTaskVirtualMachine(string vMachineId);
    public Task CheckStudyTaskAsync(string vMachineId, string vmImageId, Guid pTaskId);

    #endregion
}

public struct StudyTaskOptions
{
    public Guid[]? StudentIds { get; set; }
    public string? Title { get; set; }
    public ushort? Number { get; set; }
}