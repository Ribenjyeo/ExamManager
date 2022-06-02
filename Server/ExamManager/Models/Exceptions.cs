namespace ExamManager.Models;

public class DataNotFoundException<TType> : Exception
{
    public DataNotFoundException()
    { }
    public DataNotFoundException(string message) : base(message)
    { }

    public DataNotFoundException<TType> WithMessage(string message)
    {
        return new DataNotFoundException<TType>(message);
    }
}