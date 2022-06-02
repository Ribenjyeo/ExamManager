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
        _logger = logger;
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

        var processInfo = new ProcessStartInfo(processScript, processArguments);
        processInfo.RedirectStandardOutput = true;

        using var process = new Process();
        process.StartInfo = processInfo;

        try
        {
            process.Start();
            _logger.LogInformation($"Process {processInfo.FileName} has started");
            await WaitForExecutionCompleted(process.WaitForExit, timeForWaiting: 5000);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Process {processInfo.FileName} exited. Exception: {ex.Message}");
            process.Close();
            throw;
        }

        var result = string.Empty;
        try
        {
            result = process.StandardOutput.ReadToEnd();
            if (!process.HasExited)
            {
                process.Close();
            }
        }
        catch (Exception ex)
        {
            throw;
        }
        return result;
    }

    private async Task WaitForExecutionCompleted(Action wait, CancellationToken? token = null, long? timeForWaiting = null)
    {
        var isCompleted = false;
        var timer = Stopwatch.StartNew();

        _ = Task.Run(() =>
          {
              wait();
              isCompleted = true;
          });

        while (!isCompleted && 
            (token.HasValue ? !token.Value.IsCancellationRequested : true ) &&
            (timeForWaiting.HasValue ? timer.ElapsedMilliseconds < timeForWaiting : true)
            )
        {
            await Task.Run(() => Task.Delay(1000));
        }

    }
}

public static class ScriptManagerExtensions
{
    public static void AddScriptManager(this IServiceCollection services, IWebHostEnvironment environment)
    {
        services.AddTransient<ScriptManager>(provider => new(provider.GetService<IConfiguration>()!, environment, provider.GetService<ILogger<ScriptManager>>()!));
    }
}