using AutoMapper;
using ExamManager.Models;
using OfficeOpenXml;
using System.Threading;

namespace ExamManager.Services;

public class FileService : IFileService
{
    Dictionary<string, int> _allowedColumnNames { get; set; }
    IMapper _mapper { get; set; }
    public FileService(IMapper mapper)
    {
        _allowedColumnNames = new()
        {
            { "Имя", 1 },
            { "Фамилия", 2 },
            { "Логин", 3 },
            { "Пароль", 4 },
            { "Группа", 5 }
        };
        _mapper = mapper;
    }    

    public async Task<IEnumerable<(User User, string GroupName)>> ParseUsersFromFile(IFormFile file, CancellationToken cancellationToken)
    {
        var extension = Path.GetExtension(file.FileName);
        var newUsers = extension switch
        {
            ".xlsx" or ".xls" => await ParseExcelUsers(file, cancellationToken),
            ".csv" => await ParseCsvUsers(file, cancellationToken),
            _ => throw new InvalidDataException($"Файл с расширением .{extension} не поддерживается")
        };

        return newUsers;
    }

    private Dictionary<string, int> GenerateFieldColumns(ExcelWorksheet worksheet)
    {
        var fieldColumns = new Dictionary<string, int>();        
        var columnCount = worksheet.Dimension.Columns;

        for (int i = 1; i <= columnCount; i++)
        {
            fieldColumns.Add(worksheet.Cells[1, i].Value.ToString(), i);
        }

        if (fieldColumns.Keys.Except(_allowedColumnNames.Keys).Count() == 0)
        {
            return fieldColumns;
        }

        return _allowedColumnNames;
    }

    private async Task<IEnumerable<(User User, string GroupName)>> ParseExcelUsers(IFormFile file, CancellationToken cancellationToken)
    {
        var users = new List<(User User, string GroupName)>();

        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream, cancellationToken);

            using (var package = new ExcelPackage(stream))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                var v = worksheet.Cells[1, 1];
                var rowCount = worksheet.Dimension.Rows;
                var fieldColumns = GenerateFieldColumns(worksheet);

                for (int row = 2; row <= rowCount; row++)
                {
                    var registerModel = new RegisterEditModel
                    {
                        FirstName = worksheet.Cells[row, fieldColumns["Имя"]].Value.ToString().Trim(),
                        LastName = worksheet.Cells[row, fieldColumns["Фамилия"]].Value.ToString().Trim(),
                        Login = worksheet.Cells[row, fieldColumns["Логин"]].Value.ToString().Trim(),
                        Password = worksheet.Cells[row, fieldColumns["Пароль"]].Value.ToString().Trim(),
                        Role = UserRole.STUDENT
                    };

                    var groupName = worksheet.Cells[row, fieldColumns["Группа"]].Value.ToString().Trim();
                    users.Add((_mapper.Map<RegisterEditModel, User>(registerModel), groupName));
                }
            }
        }

        return users;
    }
    private async Task<IEnumerable<(User Users, string GroupNames)>> ParseCsvUsers(IFormFile file, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}