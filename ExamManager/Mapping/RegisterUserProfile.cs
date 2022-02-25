using AutoMapper;
using ExamManager.Models;

namespace ExamManager.Mapping;

public partial class MappingProfile
{
    [PerformMapping]
    private void RegisterUserProfile()
    {
        CreateMap<RegisterEditModel, User>()
            .ForMember(user => user.Login, options => options.MapFrom(model => model.Login))
            .ForMember(user => user.PasswordHash, options => options.MapFrom(model => _securityService.Encrypt(model.Password)))
            .ForMember(user => user.FirstName, options => options.MapFrom(model => model.FirstName))
            .ForMember(user => user.MiddleName, options => options.MapFrom(model => model.MiddleName));
    }
}
