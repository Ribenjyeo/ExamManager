using AutoMapper;
using ExamManager.Services;
using ExamManager.Models;
using ExamManager.Models.RequestModels;
using System.Reflection;

namespace ExamManager.Mapping;

public partial class MappingProfile
{
    [PerformMapping]
    private void VirtualMachineProfile()
    {
        CreateMap<CreateTaskRequest.VirtualMachineView, VirtualMachineImage>()
            .ForMember(vmImage => vmImage.ID, options => options.MapFrom(vmView => vmView.id))
            .ForMember(vmImage => vmImage.Title, options => options.MapFrom(vmView => vmView.title))
            .ForMember(vmImage => vmImage.Order, options => options.MapFrom(vmView => vmView.order));

        CreateMap<StartVirtualMachineResult, VirtualMachine>()
            .ForMember(vMachine => vMachine.Name, options => options.MapFrom(result => result.vmid))
            .ForMember(vMachine => vMachine.Host, options => options.MapFrom(result => result.address))
            .ForMember(vMachine => vMachine.Port, options => options.MapFrom(result => result.port))
            .ForMember(vMachine => vMachine.Password, options => options.MapFrom(result => result.password));
    }
}