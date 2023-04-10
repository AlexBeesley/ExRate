namespace ExRate_API.DataFromService
{
    public interface IGetExRateForecast
    {
        string GetOutput(string targetCurrency, string baseCurrency, string modelType);
    }
}
