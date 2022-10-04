import datetime
import GetResponseFromAPI

# Global variables
days_in_a_year = 365


def processCurrent():
    response_GBPtoUSD = GetResponseFromAPI.getCurrent("GBP", "USD")
    response_GBPtoEUR = GetResponseFromAPI.getCurrent("GBP", "EUR")
    result_GBPtoUSD = response_GBPtoUSD["result"]
    result_GBPtoEUR = response_GBPtoEUR["result"]
    print("Current GBP to USD Exchange Rate : ", result_GBPtoUSD)
    print("Current GBP to EUR Exchange Rate : ", result_GBPtoEUR)


def processTimeSeries():
    end_date = datetime.datetime.now()
    start_date = datetime.datetime.now() - datetime.timedelta(days=days_in_a_year)

    response = GetResponseFromAPI.getTimeSeries("GBP", "USD,EUR", start_date.strftime("%Y-%m-%d"),
                                                end_date.strftime("%Y-%m-%d"))

    GBPtoUSD_rates = []
    GBPtoEUR_rates = []

    dates = []

    count = 0

    while count < days_in_a_year:
        working_date = (start_date + datetime.timedelta(days=count)).strftime("%Y-%m-%d")
        GBPtoUSD_rates.append(response['rates'][working_date]['USD'])
        GBPtoEUR_rates.append(response['rates'][working_date]['EUR'])
        dates.append(working_date)
        count = count + 1

    print("GBP to USD Exchange Rates over the past year: ", GBPtoUSD_rates)
    print("GBP to EUR Exchange Rates over the past year: ", GBPtoEUR_rates)
    print(dates)


processCurrent()
processTimeSeries()
