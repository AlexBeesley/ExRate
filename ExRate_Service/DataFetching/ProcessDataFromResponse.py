import datetime
from DataFetching import GetResponseFromAPI


class ProcessDataFromResponse:
    def __init__(self, base, target, days_in_a_year=365):
        self.base = base
        self.target = target
        self.days_in_a_year = days_in_a_year

    def process(self):
        end_date = datetime.datetime.now()
        start_date = datetime.datetime.now() - datetime.timedelta(days=self.days_in_a_year)

        response = GetResponseFromAPI.getTimeSeries(self.base, self.target, start_date.strftime("%Y-%m-%d"),
                                                    end_date.strftime("%Y-%m-%d"))

        rates = []
        dates = []

        count = 0
        while count < self.days_in_a_year:
            working_date = (start_date + datetime.timedelta(days=count)).strftime("%Y-%m-%d")
            rates.append(response['rates'][working_date][self.target])
            dates.append(working_date)
            count += 1

        return rates, dates

