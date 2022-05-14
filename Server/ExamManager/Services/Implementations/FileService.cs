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
            { "Пароль", 4 }
        };
        _mapper = mapper;
    }

    public async Task<IEnumerable<RegisterEditModel>> ParseExcelRegisterModels(IFormFile file, CancellationToken cancellationToken)
    {
        var users = new List<RegisterEditModel>();

        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream, cancellationToken);

            using (var package = new ExcelPackage(stream))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension.Rows;
                var fieldColumns = GenerateFieldColumns(worksheet);

                for (int row = 2; row <= rowCount; row++)
                {
                    users.Add(new RegisterEditModel
                    {
                        FirstName = worksheet.Cells[row, fieldColumns["Имя"]].Value.ToString().Trim(),
                        LastName = worksheet.Cells[row, fieldColumns["Фамилия"]].Value.ToString().Trim(),
                        Login = worksheet.Cells[row, fieldColumns["Логин"]].Value.ToString().Trim(),
                        Password = worksheet.Cells[row, fieldColumns["Пароль"]].Value.ToString().Trim(),
                        Role = UserRole.STUDENT
                    });
                }
            }
        }

        return users;
    }

    public async Task<IEnumerable<User>> ParseExcelUsers(IFormFile file, CancellationToken cancellationToken)
    {
        var users = new List<User>();

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

                    users.Add(_mapper.Map<RegisterEditModel, User>(registerModel));
                }
            }
        }

        return users;
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
}