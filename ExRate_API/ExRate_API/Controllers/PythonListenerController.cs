using ExRate_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExRate_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PythonListenerController : ControllerBase
    {
        [HttpGet("{baseCurrency}/{targetCurrency}")]
        public IActionResult Get(string baseCurrency, string targetCurrency)
        {
            var pythonListener = new PythonListener();
            var output = pythonListener.getOutput(baseCurrency, targetCurrency);
            return Ok(new { output });
        }

    }
}