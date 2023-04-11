namespace ExRate_API.DataFromService
{
    public interface IGetExRateForecast
    {
        Task<string> GetOutputAsync(string targetCurrency, string baseCurrency, string modelType);
    }
}
