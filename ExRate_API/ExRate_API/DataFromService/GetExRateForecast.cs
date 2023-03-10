using ExRate_API.Controllers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using System.Runtime.CompilerServices;
using System;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecast : IGetExRateForecast
    {
        private readonly ILogger<GetExRateForecastController> _logger;

        public GetExRateForecast(ILogger<GetExRateForecastController> logger)
        {
            _logger = logger;
        }

        public string getOutputLocally(string targetCurrency, string baseCurrency)
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

            process.ErrorDataReceived += (sender, e) => output += e.Data;
            process.OutputDataReceived += (sender, e) => output += e.Data;

            processSequence(process);

            return CombineIntoJson(output);
        }

        public string getOutputInContainer(string targetCurrency, string baseCurrency)
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

        private string CombineIntoJson(string output)
        {
            var historicalData = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(0, output.IndexOf("}") + 1));
            var forecast = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(output.IndexOf("}") + 1));

            var result = new Dictionary<string, Dictionary<string, object>>();
            result.Add("historicalData", historicalData ?? new Dictionary<string, object>());
            result.Add("forecast", forecast ?? new Dictionary<string, object>());

            var json = JsonConvert.SerializeObject(result, Formatting.Indented);

            return json;
        }

        private void processSequence(Process process)
        {
            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();
            process.WaitForExit();
        }

    }
}
