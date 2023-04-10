import datetime
from DataPreprocessing.GetResponseFromAPI import GetResponseFromAPI


class ProcessDataFromResponse:
    def __init__(self, base, target, days_in_a_year=365, days_in_a_week=7):
        self.base = base
        self.target = target
        self.days_in_a_year = days_in_a_year
        self.days_in_a_week = days_in_a_week
        self.year_rates = []
        self.year_dates = []
        self.week_rates = []
        self.week_dates = []

    def toLists(self, rates, dates, start_date, response, days):
        for i in range(days):
            working_date = (start_date + datetime.timedelta(days=i)).strftime('%Y-%m-%d')
            if response and 'rates' in response and working_date in response['rates']:
                rates.append(response['rates'][working_date][self.target])
                dates.append(working_date)
            else:
                print(f"Warning: Data for {working_date} not available.")

    def process(self):
        week_end_date = datetime.datetime.now()
        week_start_date = datetime.datetime.now() - datetime.timedelta(days=self.days_in_a_week)

        year_end_date = datetime.datetime.now() - datetime.timedelta(days=self.days_in_a_week)
        year_start_date = year_end_date - datetime.timedelta(days=self.days_in_a_year)

        week_response = GetResponseFromAPI().getTimeSeries(self.base, self.target, week_start_date.strftime("%Y-%m-%d"),
                                                         week_end_date.strftime("%Y-%m-%d"))

        year_response = GetResponseFromAPI().getTimeSeries(self.base, self.target, year_start_date.strftime("%Y-%m-%d"),
                                                         year_end_date.strftime("%Y-%m-%d"))

        self.toLists(self.week_rates, self.week_dates, week_start_date, week_response, self.days_in_a_week)
        self.toLists(self.year_rates, self.year_dates, year_start_date, year_response, self.days_in_a_year)

        return self.week_rates, self.week_dates, self.year_rates, self.year_dates
