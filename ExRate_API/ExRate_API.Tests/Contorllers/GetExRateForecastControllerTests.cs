using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System.Text.Json.Nodes;

namespace ExRate_API.Tests.Controllers
{
    [TestFixture]
    public class GetExRateForecastControllerTests
    {
        private GetExRateForecastController _controller;
        private Mock<ILogger<GetExRateForecastController>> _loggerMock;

        [SetUp]
        public void Setup()
        {
            // Create a mock logger object
            _loggerMock = new Mock<ILogger<GetExRateForecastController>>();

            // Create an instance of the controller with the mock logger
            _controller = new GetExRateForecastController(_loggerMock.Object);
        }

        [Test]
        public void Get_ReturnsJson()
        {
            // Act
            var result = _controller.Get("USD", "EUR");

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = (OkObjectResult)result;
            Assert.IsInstanceOf<string>(okResult.Value);
        }
    }
}