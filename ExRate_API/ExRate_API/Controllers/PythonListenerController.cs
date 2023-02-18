using ExRate_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExRate_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PythonListenerController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var pythonListener = new PythonListener();
            var output = pythonListener.getOutput();
            return Ok(new { output });
        }
    }
}
