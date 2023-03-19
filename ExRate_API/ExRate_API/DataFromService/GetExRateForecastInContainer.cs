using ExRate_API.Controllers;
using System.Diagnostics;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastInContainer : GetExRateForecastBase, IGetExRateForecast
    {
        public GetExRateForecastInContainer(ILogger<GetExRateForecastController> logger) : base(logger)
        {
        }

        public string getOutput(string targetCurrency, string baseCurrency)
        {
            var scriptPath = "/app/ExRate_Service/Program.py";

            var output = string.Empty;
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "/usr/bin/python3.9",
                    Arguments = scriptPath + $" -b {targetCurrency} -t {baseCurrency}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = "/app/ExRate_Service/"
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
