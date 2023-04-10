using ExRate_API.Controllers;
using Newtonsoft.Json;
using System.Diagnostics;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastBase
    {
        protected readonly ILogger<GetExRateForecastController> _logger;

        public GetExRateForecastBase(ILogger<GetExRateForecastController> logger)
        {
            _logger = logger;
        }

        protected string RunProcess(string fileName, string scriptPath, string scriptDirectory, string targetCurrency, string baseCurrency, string modelType)
        {
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = fileName,
                    Arguments = scriptPath + $" -b {targetCurrency} -t {baseCurrency} -m {modelType}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = scriptDirectory
                },
                EnableRaisingEvents = true
            };

            string output = string.Empty;
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
            // find the index of the first occurrence of '{' in the string
            int startIndex = output.IndexOf('{');

            // if '{' is not found, return an empty dictionary
            if (startIndex < 0)
            {
                return JsonConvert.SerializeObject(new Dictionary<string, Dictionary<string, object>>(), Formatting.Indented);
            }

            // extract the substring starting from the first '{'
            string json = output.Substring(startIndex);

            // deserialize the json into two dictionaries
            var historicalData = JsonConvert.DeserializeObject<Dictionary<string, object>>(json.Substring(0, json.IndexOf("}") + 1));
            var forecast = JsonConvert.DeserializeObject<Dictionary<string, object>>(json.Substring(json.IndexOf("}") + 1));

            // combine the two dictionaries into a result dictionary
            var result = new Dictionary<string, Dictionary<string, object>>
            {
                { "historicalData", historicalData ?? new Dictionary<string, object>() },
                { "forecast", forecast ?? new Dictionary<string, object>() }
            };

            // serialize the result dictionary into json
            string outputJson = JsonConvert.SerializeObject(result, Formatting.Indented);

            return outputJson;
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
