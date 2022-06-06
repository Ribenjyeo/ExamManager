using ExamManager.Models;

namespace ExamManager.Services;

public interface IVirtualMachineService
{
    #region VMControl

    // Скрипт для взаимодействия с виртуальными машинами
    public const string VMControl = "VMControl";
    // Аргументы для запуска виртуальной машины
    public const string StartVM = "StartVM";
    // Аргументы для получения статуса виртуальной машины
    public const string StatusVM = "StatusVM";
    // Аргументы для остановки виртуальной машины
    public const string StopVM = "StopVM";

    public const string CheckVM = "CheckVM";

    #endregion

    /// <summary>
    /// Запустить виртуальную машину
    /// </summary>
    /// <param name="virtualMachineId">Идентификатор образа виртуальной машины</param>
    /// <param name="owner">Пользватель, пытающийся запустить виртуальную машину</param>
    /// <returns></returns>
    public Task<VirtualMachine?> StartVirtualMachine(string vmImageId, Guid ownerId, Guid personalTaskId);

    /// <summary>
    /// Остановить виртуальную машину
    /// </summary>
    /// <param name="virtualMachineId">Идентификатор образа виртуальной машины</param>
    /// <param name="owner">Пользватель, пытающийся остановить виртуальную машину</param>
    /// <returns></returns>
    public Task StopVirtualMachine(string virtualMachineId);

    public Task<string> GetVirtualMachineStatus(string virtualMachineId);

    public Task<VirtualMachine?> GetVirtualMachine(string virtualMachineID);

    public Task CheckVirtualMachine(string vMachineId, string vmImageId, Guid personalTaskId);

    public Task<string> GenerateConnectionFile(VirtualMachine vMachine);
}