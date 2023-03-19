using ExRate_API.Controllers;
using System.Diagnostics;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastLocally : GetExRateForecastBase, IGetExRateForecast
    {
        public GetExRateForecastLocally(ILogger<GetExRateForecastController> logger) : base(logger)
        {
        }

        public string getOutput(string targetCurrency, string baseCurrency)
        {
            var scriptPath = @"C:\dev\ExRate\ExRate_Service" + @"\Program.py";
            var scriptDirectory = Path.GetDirectoryName(scriptPath);

            var output = string.Empty;
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "C:\\Users\\david\\AppData\\Local\\Programs\\Python\\Python310\\python.exe", //Replace with local python executable.
                    Arguments = scriptPath + $" -b {targetCurrency} -t {baseCurrency}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = scriptDirectory
                },
                EnableRaisingEvents = true
            };

            process.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    _logger.LogError($"Error from process: {e.Data}");
                }
            };
            process.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    output += e.Data;
                }
            };

            processSequence(process);

            return CombineIntoJson(output);
        }
    }
}
