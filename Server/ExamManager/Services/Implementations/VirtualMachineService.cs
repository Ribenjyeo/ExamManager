using AutoMapper;
using ExamManager.DAO;
using ExamManager.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;

namespace ExamManager.Services;

public class VirtualMachineService : IVirtualMachineService
{
    ExamManagerDBContext _dbContext { get; set; }
    ScriptManager _scriptManager { get; set; }
    IMapper _mapper { get; set; }

    public VirtualMachineService(ExamManagerDBContext dbContext, ScriptManager scriptManager, IMapper mapper)
    {
        _dbContext = dbContext;
        _scriptManager = scriptManager;
        _mapper = mapper;
    }

    public async Task<string> GenerateConnectionFile(VirtualMachine vMachine)
    {
        var fileText = new StringBuilder();

        fileText.AppendLine("ConnMethod=tcp");
        fileText.AppendLine($"ConnTime={DateTime.Now}");
        fileText.AppendLine($"FriendlyName={vMachine.Name}");
        fileText.AppendLine($"Host={vMachine.Host}:{vMachine.Port}");
        fileText.AppendLine($"Password={vMachine.Password}");
        fileText.AppendLine($"RelativePtr=0");
        fileText.AppendLine($"Uuid={vMachine.ObjectID}");

        return await Task.FromResult(fileText.ToString());
    }

    public async Task<VirtualMachine?> GetVirtualMachine(string virtualMachineID)
    {
        var vMachine = await _dbContext.VirtualMachines!.FirstOrDefaultAsync(vm => vm.Name == virtualMachineID);
        return vMachine;
    }

    public async Task<VirtualMachine?> StartVirtualMachine(string vmImageId, Guid ownerId, Guid personalTaskId)
    {
        var vMachine = await _dbContext.VirtualMachines!.Include(vm => vm.Image).FirstOrDefaultAsync(vm => vm.Image.ID == vmImageId && vm.OwnerID == ownerId && vm.TaskID == personalTaskId);
        // Если уже существует подходящий объект виртуальной машины,
        // то удаляем его
        if (vMachine is not null)
        {
            _dbContext.VirtualMachines!.Remove(vMachine);
        }

        var result = string.Empty;
        try
        {
            result = await _scriptManager.Execute(
                IVirtualMachineService.VMControl,
                IVirtualMachineService.StartVM,
                new()
                {
                    { "id", vmImageId }
                });
        

        var vmStatus = JsonConvert.DeserializeObject<StartVirtualMachineResult?>(result);
        
        if (vmStatus is null)
        {
            return null;
        }

        vMachine = _mapper.Map<StartVirtualMachineResult, VirtualMachine>(vmStatus.Value);
        vMachine.OwnerID = ownerId;
        vMachine.TaskID = personalTaskId;
        vMachine.Status = VMStatus.RUNNING;
        }
        catch
        {
            return null;
        }

        await _dbContext.AddAsync(vMachine);
        await _dbContext.SaveChangesAsync();

        return vMachine;
    }

    public async Task StopVirtualMachine(string virtualMachineId)
    {
        var vMachine = await _dbContext.VirtualMachines!.FirstOrDefaultAsync(vm => vm.Name == virtualMachineId);

        if (vMachine is null)
        {
            throw new InvalidDataException($"Виртуальной машины {virtualMachineId} не существует");
        }

        var result = await _scriptManager.Execute(
            IVirtualMachineService.VMControl,
            IVirtualMachineService.StopVM,
            new()
            {
                { "vm_id", virtualMachineId }
            });

        var vmStatus = JsonConvert.DeserializeObject<VirtualMachineStatus?>(result);
        if (vmStatus is null || vmStatus.Value.status == VMStatus.RUNNING.ToLowerString())
        {
            throw new InvalidDataException($"Не удалось остановить виртуальную машину {virtualMachineId}");
        }

        vMachine.Status = VMStatus.KILLED;

        await _dbContext.SaveChangesAsync();
    }

    public async Task<string> GetVirtualMachineStatus(string virtualMachineId)
    {
        var result = await _scriptManager.Execute(
            IVirtualMachineService.VMControl,
            IVirtualMachineService.StatusVM,
            new()
            {
                { "vm_id", virtualMachineId }
            });

        var vmStatus = JsonConvert.DeserializeObject<VirtualMachineStatus?>(result);
        if (vmStatus is null)
        {
            throw new InvalidDataException($"Не удалось получить статус виртуальной машины {virtualMachineId}");
        }

        return vmStatus.Value.status;
    }
}

public struct StartVirtualMachineResult
{
    public string vmid { get; set; }	
	public string status { get; set; }
    public string address { get; set; }
	public ushort port { get; set; }
	public string password { get; set; }
}

public struct VirtualMachineStatus
{
    public string vmid { get; set; }
    public string status { get; set; }
}