using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace ExRate_API.DataFromService
{
    public class GetDataFromService
    {
        private static string GetPath([CallerFilePath] string? path = null)
        {
            return Directory.GetParent(Directory.GetParent(path).FullName).FullName;
        }
        private static void Process_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            Console.WriteLine(e.Data);
        }

        StreamReader RunScript(string arg1, string arg2)
        {
            var path = GetPath() + @"\Service\main.py";
            arg1 = "USD";
            arg2 = "GBP";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "C:\\Users\\david\\AppData\\Local\\Programs\\Python\\Python310\\python.exe", //Replace with local python executable.
                    Arguments = path + $" {arg1} {arg2}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                },
                EnableRaisingEvents = true
            };
            process.ErrorDataReceived += Process_OutputDataReceived;
            process.OutputDataReceived += Process_OutputDataReceived;

            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();
            process.WaitForExit();

            return process.StandardOutput;
        }

    }
}
