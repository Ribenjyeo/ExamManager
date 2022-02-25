using ExamManager.Models;

namespace ExamManager.Mapping;


public partial class MappingProfile
{
    [PerformMapping]
    private void UserViewProfile()
    {
        CreateMap<User, UserViewModel>()
            .ForMember(model => model.FirstName, options => options.MapFrom(user => user.FirstName))
            .ForMember(model => model.MiddleName, options => options.MapFrom(user => user.MiddleName));
    }
}
