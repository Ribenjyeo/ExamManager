namespace KISAdministration.Models;

public interface IUserValidationModel
{
    public Guid GetObjectID();
    public string GetLogin();
    public string GetFirstName();
    public string GetMiddleName();
}
