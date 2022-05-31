using AutoMapper;
using ExamManager.DAO;
using ExamManager.Mapping;
using ExamManager.Middleware;
using ExamManager.Services;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
var builder = WebApplication.CreateBuilder(args);
var configManager = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.SuppressConsumesConstraintForFormFileParameters = true;
        options.SuppressInferBindingSourcesForParameters = true;
        options.SuppressModelStateInvalidFilter = true;
        options.SuppressMapClientErrors = true;
        options.ClientErrorMapping[StatusCodes.Status404NotFound].Link =
            "https://httpstatuses.com/404";
    });

// Добавляем MVC
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var connectionString = configManager.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DbContext, ExamManagerDBContext>(
    dbContextOptions => dbContextOptions
        .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
        .LogTo(Console.WriteLine, LogLevel.Information)
        .EnableSensitiveDataLogging()
        .EnableDetailedErrors());

builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IGroupService, GroupService>();
builder.Services.AddTransient<ISecurityService, SecurityService>();
builder.Services.AddTransient<IStudyTaskService, StudyTaskService>();
builder.Services.AddTransient<IVirtualMachineService, VirtualMachineService>();
builder.Services.AddTransient<IJwtUtils, JwtUtils>();
builder.Services.AddTransient<IFileService, FileService>();
builder.Services.AddTransient<SignInManager>((serviceProvider) => new SignInManager(serviceProvider));
builder.Services.AddScriptManager(builder.Environment);

//builder.Services.AddClaimsAuthentication();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();

builder.Services.AddSingleton(provider => new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new MappingProfile(provider.GetService<ISecurityService>()!));
})
.CreateMapper());


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseMiddleware<JwtMiddleware>();

app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
