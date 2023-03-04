using Newtonsoft.Json;
using System.Diagnostics;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecast : IGetExRateForecast
    {
        private string GetSolutionParentDirectory()
        {
            return @"C:\dev\ExRate\ExRate_Service";
        }

        public string getOutputLocally(string targetCurrency, string baseCurrency)
        {
            var scriptPath = GetSolutionParentDirectory() + @"\Program.py";
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
            var scriptPath = "/app/python_solution/Program.py";

            var output = string.Empty;
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "python", // Use the Python executable installed in the Docker container
                    Arguments = scriptPath + $" -b {targetCurrency} -t {baseCurrency}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = "/app/python_solution" // Set the working directory to the path within the container
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

    }
}
