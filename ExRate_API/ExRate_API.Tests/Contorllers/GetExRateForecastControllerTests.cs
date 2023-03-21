using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json.Nodes;

namespace ExRate_API.Tests.Controllers
{
    public class GetExRateForecastControllerTests
    {
        private GetExRateForecastController _controller;
        private Mock<ILogger<GetExRateForecastController>> _loggerMock;
        private Mock<IGetExRateForecast> _exRateForecastMock;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<GetExRateForecastController>>();
            _exRateForecastMock = new Mock<IGetExRateForecast>();

            _controller = new GetExRateForecastController(_loggerMock.Object);
        }

        [Test]
        public void Get_ReturnsOkResult_WhenExRateForecastReturnsData()
        {
            // Arrange
            string baseCurrency = "USD";
            string targetCurrency = "EUR";
            string expectedOutput = "some data";

            _exRateForecastMock.Setup(x => x.getOutput(baseCurrency, targetCurrency))
                .Returns(expectedOutput);

            // Act
            var result = _controller.Get(baseCurrency, targetCurrency);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
        }
    }
}

