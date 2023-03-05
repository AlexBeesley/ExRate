using ExRate_API.Controllers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using Microsoft.Extensions.Logging;


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

            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();
            process.WaitForExit();

            var historicalData = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(0, output.IndexOf("}") + 1));
            var forecast = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(output.IndexOf("}") + 1));

            var result = new Dictionary<string, Dictionary<string, object>>();
            result.Add("historicalData", historicalData ?? new Dictionary<string, object>());
            result.Add("forecast", forecast ?? new Dictionary<string, object>());

            var json = JsonConvert.SerializeObject(result, Formatting.Indented);

            return json;
        }

        public string getOutputInContainer(string targetCurrency, string baseCurrency)
        {
            _logger.LogInformation($"Container method running");

            var scriptPath = "/app/Program.py";

            var output = string.Empty;
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "python3",
                    Arguments = scriptPath + $" -b {targetCurrency} -t {baseCurrency}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                },
                EnableRaisingEvents = true
            };

            process.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    _logger.LogInformation($"Error from process: {e.Data}");
                }
            };
            process.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    _logger.LogInformation($"Output from process: {e.Data}");
                    output += e.Data;
                }
            };

            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();
            process.WaitForExit();

            _logger.LogInformation($"Raw output: {output}");

            var historicalData = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(0, output.IndexOf("}") + 1));
            var forecast = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(output.IndexOf("}") + 1));

            _logger.LogInformation($"Forecast: {JsonConvert.SerializeObject(forecast)}");

            var result = new Dictionary<string, Dictionary<string, object>>();
            result.Add("historicalData", historicalData ?? new Dictionary<string, object>());
            result.Add("forecast", forecast ?? new Dictionary<string, object>());

            _logger.LogInformation($"Result: {JsonConvert.SerializeObject(result)}");

            var json = JsonConvert.SerializeObject(result, Formatting.Indented);

            _logger.LogInformation($"Final JSON: {json}");

            return json;
        }


    }
}
