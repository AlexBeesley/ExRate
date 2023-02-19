using Newtonsoft.Json;
using System.Diagnostics;

namespace ExRate_API.Services
{
    public class PythonListener
    {
        private string GetSolutionParentDirectory()
        {
            return @"C:\dev\ExRate\ExRate_Service";
        }

        public string getOutput(string targetCurrency, string baseCurrency)
        {
            var scriptPath = GetSolutionParentDirectory() + @"\Program.py";
            var scriptDirectory = Path.GetDirectoryName(scriptPath);

            var output = String.Empty;
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
            result.Add("historicalData", historicalData);
            result.Add("forecast", forecast);

            var json = JsonConvert.SerializeObject(result, Formatting.Indented);

            return json;
        }
    }
}
