import GetResponseFromAPI
import datetime

# Global variables
days_in_a_year = 365


def getCurrent():
    output = GetResponseFromAPI.getCurrent("GBP", "EUR")
    result = output["result"]
    print(result)


def getTimeSeries():
    end_date = datetime.datetime.now()
    start_date = datetime.datetime.now() - datetime.timedelta(days=days_in_a_year)

    output = GetResponseFromAPI.getTimeSeries("GBP", "USD,EUR", start_date.strftime("%Y-%m-%d"),
                                              end_date.strftime("%Y-%m-%d"))
    period = end_date - start_date
    listOfRates = []
    count = 0

    while count < days_in_a_year:
        y = start_date + datetime.timedelta(days=count)
        z = y.strftime("%Y-%m-%d")
        listOfRates.append(z)
        count = count + 1

    print(listOfRates)
    print(period.days)
    print(output)


getTimeSeries()
