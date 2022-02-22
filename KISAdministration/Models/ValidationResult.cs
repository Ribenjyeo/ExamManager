namespace KISAdministration.Models;

public class ValidationResult
{
    public bool HasErrors
    {
        get
        {
            return (ErrorMessages?.Keys.Count ?? 0) + (CommonMessages?.Count ?? 0) > 0;
        }
    }

    public Dictionary<string, List<string>> ErrorMessages { get; set; }

    public List<string> CommonMessages { get; set; }

    public ValidationResult()
    {
        ErrorMessages = new(5);
        CommonMessages = new(5);
    }

    #region ADD_MESSAGE

    public void AddMessage(string key, string message)
    {
        if (!ErrorMessages.ContainsKey(key))
        {
            ErrorMessages.Add(key, new());
        }

        ErrorMessages[key].Add(message);
    }

    public void AddCommonMessage(string message)
    {
        if (CommonMessages.Contains(message))
            return;

        CommonMessages.Add(message);
    }

    #endregion

    #region REMOVE_MESSAGE

    public void RemoveMessages(string key)
    {
        var message = ErrorMessages.Where(msg => msg.Key.Equals(key));

        if (!ErrorMessages.ContainsKey(key))
        {
            return;
        }

        ErrorMessages.Remove(key);
    }

    public void RemoveCommonMessage(string message)
    {
        CommonMessages.Remove(message);
    }

    #endregion
}