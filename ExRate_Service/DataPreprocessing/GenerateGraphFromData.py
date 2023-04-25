import datetime
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import seaborn as sns


class GenerateGraphsFromData:
    def __init__(self, model_type, yrates, wrates, ydates, wdates, base, target, history, forecast):
        self.model_type = model_type
        self.yrates = yrates
        self.wrates = wrates
        self.ydates = ydates
        self.wdates = wdates
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

        historical_dates = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in self.ydates[-60:]]
        historical_rates = pd.to_numeric(self.yrates[-60:])
        last_historical_date = historical_dates[-1]
        last_historical_rate = historical_rates[-1]
        week_dates = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in self.wdates]
        week_rates = pd.to_numeric(self.wrates)
        forecast_dates = [last_historical_date + datetime.timedelta(days=i) for i in range(1, 8)]
        forecast_rates = [week_rates[0]] + pd.to_numeric(self.forecast[1:]).tolist()

        plt.figure(figsize=(12, 6))
        plt.plot(historical_dates + week_dates, historical_rates.tolist() + week_rates.tolist(),
                 label='Historical Exchange Rates')
        plt.plot(week_dates, week_rates, label='Actual Exchange Rates', color='red')
        plt.plot(forecast_dates, forecast_rates, label='Forecasted Exchange Rates', linestyle='--')
        plt.xlabel('Dates')
        plt.ylabel('Exchange Rates')
        plt.title(f'Exchange Rates for {self.base} to {self.target} over the last year '
                  f'with the 7-day forecast using the {self.model_type} model.')
        plt.gca().xaxis.set_major_locator(mdates.MonthLocator(interval=1))
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
        plt.gcf().autofmt_xdate()
        plt.legend()
        plt.show()

