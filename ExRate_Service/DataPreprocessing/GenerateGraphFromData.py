import datetime
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import seaborn as sns


class GenerateGraphsFromData:
    def __init__(self, model_type, yrates, wrates, dates, base, target, history, forecast):
        self.model_type = model_type
        self.yrates = yrates
        self.wrates = wrates
        self.dates = dates
        self.base = base
        self.target = target
        self.history = history.history
        self.forecast = forecast

    def display_evaluation_graphs(self):
        sns.set_style("whitegrid")

        plt.figure(figsize=(12, 6))
        plt.plot(self.history['mae'], label='Training MAE')
        plt.plot(self.history['val_mae'], label='Validation MAE')
        plt.xlabel('Epochs')
        plt.ylabel('Mean Absolute Error')
        plt.title(f'Mean Absolute Error for the {self.model_type} model with {self.base}-{self.target}.')
        plt.legend()
        plt.show()

        plt.figure(figsize=(12, 6))
        plt.plot(self.wrates, label='Actual')
        plt.plot(self.forecast, label='Forecast')
        plt.xlabel('Days')
        plt.ylabel('Exchange Rates')
        plt.title(f'Actual vs Forecast for {self.model_type} model with {self.base}-{self.target}.')
        plt.legend()
        plt.show()

        combined_rates = self.yrates[-30:] + self.forecast
        combined_dates = self.dates[-30:] + [datetime.date.today() + datetime.timedelta(days=i) for i in range(1, 8)]
        rates = pd.to_numeric(combined_rates)
        dates = pd.to_datetime(combined_dates)

        plt.figure(figsize=(12, 6))
        plt.plot(dates, rates, label='Exchange Rates')
        plt.plot([dates[-1], dates[-1] + datetime.timedelta(days=7)], [rates[-1], self.forecast[0]],
                 label='Forecast', color='green')
        plt.plot([dates[-1], dates[-1] + datetime.timedelta(days=7)], [rates[-1], self.wrates[0]],
                 label='Actual', color='red')
        plt.xlabel('Dates')
        plt.ylabel('Exchange Rates')
        plt.title(f'Exchange Rates for {self.base} to {self.target} over the last month with the 7-day forecast using '
                  f'the {self.model_type} model.')
        plt.gca().xaxis.set_major_locator(mdates.MonthLocator(interval=1))
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.gcf().autofmt_xdate()
        plt.legend()
        plt.show()
