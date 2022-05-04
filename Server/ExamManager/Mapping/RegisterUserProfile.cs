using AutoMapper;
using ExamManager.Models;
using ExamManager.Models.RequestModels;

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
            .ForMember(user => user.LastName, options => options.MapFrom(model => model.LastName))
            .ForMember(user => user.Role, options => options.MapFrom(model => model.Role));

        CreateMap<ModifyUserRequest, User>()
            .ForMember(user => user.Login, options => options.MapFrom(request => request.login))
            .ForMember(user => user.PasswordHash, options => options.MapFrom(request => _securityService.Encrypt(request.password)))
            .ForMember(user => user.FirstName, options => options.MapFrom(request => request.firstName))
            .ForMember(user => user.LastName, options => options.MapFrom(request => request.lastName))
            .ForMember(user => user.Role, options => options.MapFrom(request => request.role ?? UserRole.STUDENT))
            .ForMember(user => user.IsDefault, options => options.MapFrom(request => request.isDefault ?? false));
    }
}
