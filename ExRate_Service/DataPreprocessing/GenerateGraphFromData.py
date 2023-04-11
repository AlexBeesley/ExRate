import datetime
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import dates as mdates


class GenerateGraphFromData:
    def __init__(self, rates, dates, base, target):
        self.rates = rates
        self.dates = dates
        self.base = base
        self.target = target

    def generate_graph_with_forecast(self, forecast):
        combined_rates = self.rates + forecast
        combined_dates = self.dates + [datetime.date.today() + datetime.timedelta(days=i) for i in range(1, 8)]

        dates = pd.to_datetime(combined_dates)
        rates = pd.to_numeric(combined_rates)

        fig, ax = plt.subplots(figsize=(12, 12))
        ax.plot(dates, rates, label="Exchange Rates")

        ax.plot(dates[-7:], rates[-7:], label="7-day Forecast", color='green')

        ax.set(xlabel="Dates",
               ylabel="Exchange Rates",
               title=f"Exchange Rates for {self.base} to {self.target} over the past year with 7-day forecast.")

        ax.xaxis.set_major_locator(mdates.MonthLocator(interval=1))
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.gcf().autofmt_xdate()
        plt.legend()

        plt.show()
