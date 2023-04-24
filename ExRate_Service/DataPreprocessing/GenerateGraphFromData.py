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

        historical_rates = self.yrates[-60:]
        historical_dates = self.dates[-60:]
        actual_rates = pd.to_numeric(self.wrates[:7])
        forecast_dates = [datetime.date.today() + datetime.timedelta(days=i) for i in range(1, 8)]
        forecast_rates = pd.to_numeric(self.forecast)
        forecast_dates = pd.to_datetime(forecast_dates)
        dates = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in historical_dates]

        plt.figure(figsize=(12, 6))
        plt.plot(dates, historical_rates, label='Historical Exchange Rates')
        last_date = dates[-1]
        actual_dates = [last_date + datetime.timedelta(days=i - 1) for i in range(1, 8)]
        forecast_dates = [last_date + datetime.timedelta(days=i - 1) for i in range(1, 8)]
        plt.plot(actual_dates, actual_rates, label='Actual Exchange Rates', color='red')
        plt.plot(forecast_dates, forecast_rates, label='Forecasted Exchange Rates', linestyle='--')
        plt.xlabel('Dates')
        plt.ylabel('Exchange Rates')
        plt.title(f'Exchange Rates for {self.base} to {self.target} over the last two months '
                  f'with the 7-day forecast using the {self.model_type} model.')
        plt.gca().xaxis.set_major_locator(mdates.MonthLocator(interval=1))
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.gcf().autofmt_xdate()
        plt.legend()
        plt.show()
