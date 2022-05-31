using Microsoft.AspNetCore.Builder;
using System.Diagnostics;

namespace ExamManager.Services;

public class ScriptManager
{
    IConfiguration _configuration { get; set; }
    IWebHostEnvironment _environment { get; set; }
    ILogger<ScriptManager> _logger { get; set; }
    public ScriptManager(IConfiguration configuration, IWebHostEnvironment environment, ILogger<ScriptManager> logger)
    {
        _configuration = configuration;
        _environment = environment;
    }

    public async Task<string> Execute(string scriptName, string argumentsName, Dictionary<string, string> argumentsValue)
    {
        var processScript = _configuration[$"Scripts:{scriptName}:Default"];
        var processArguments = _configuration[$"Scripts:{scriptName}:{argumentsName}"];

        processScript = processScript.Replace("@wwwroot", _environment.WebRootPath);

        foreach (var argument in argumentsValue)
        {
            processArguments = processArguments.Replace($"{{{argument.Key}}}", argument.Value);
        }

        var processInfo = new ProcessStartInfo(Path.GetFileName(processScript), processArguments);
        processInfo.RedirectStandardOutput = true;
        processInfo.WorkingDirectory = Path.GetPathRoot(processScript);

        using var process = new Process();
        process.StartInfo = processInfo;

        try
        {
            process.Start();
            _logger.LogInformation($"Process {processInfo.FileName} has started");
            await Task.Run(() => process.WaitForExit());
        }
        catch (Exception ex)
        {
            _logger.LogError($"Process {processInfo.FileName} exited. Exception: {ex.Message}");
            process.Close();
        }

        var result = process.StandardOutput.ReadToEnd();
        return result;
    }
}

public static class ScriptManagerExtensions
{
    public static void AddScriptManager(this IServiceCollection services, IWebHostEnvironment environment)
    {
        services.AddTransient<ScriptManager>(provider => new(provider.GetService<IConfiguration>()!, environment, provider.GetService<ILogger<ScriptManager>>()!));
    }
}