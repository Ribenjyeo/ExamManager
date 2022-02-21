using AutoMapper;
using KISAdministration.Services;
using System.Reflection;

namespace KISAdministration.Mapping;

public partial class MappingProfile : Profile
{
    ISecurityService _securityService { get; set; }
    public MappingProfile(ISecurityService securityService)
    {
        _securityService = securityService;

        var mappingMethods = typeof(MappingProfile)
            .GetMethods(BindingFlags.NonPublic | BindingFlags.Instance)
            .Where(method => method.GetCustomAttribute(typeof(PerformMappingAttribute)) is not null);

        foreach (var method in mappingMethods)
        {
            try
            {
                method.Invoke(this, null);
            }
            catch
            { }
        }
    }
}

public class PerformMappingAttribute : Attribute
{

}