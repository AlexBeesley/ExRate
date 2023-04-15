import datetime
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib import dates as mdates


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
        plt.plot(self.history['loss'], label='Training Loss')
        plt.plot(self.history['val_loss'], label='Validation Loss')
        plt.xlabel('Epochs')
        plt.ylabel('Loss')
        plt.title(f'{self.base}-{self.target} Model Loss for {self.model_type} model.')
        plt.legend()
        plt.show()

        plt.figure(figsize=(12, 6))
        plt.plot(self.history['mae'], label='Training MAE')
        plt.plot(self.history['val_mae'], label='Validation MAE')
        plt.xlabel('Epochs')
        plt.ylabel('Mean Absolute Error')
        plt.title(f'{self.base}-{self.target} Model Mean Absolute Error for {self.model_type} model.')
        plt.legend()
        plt.show()

        plt.figure(figsize=(12, 6))
        plt.plot(self.wrates, label='Actual')
        plt.plot(self.forecast, label='Forecast')
        plt.xlabel('Days')
        plt.ylabel('Exchange Rates')
        plt.title(f'{self.base}-{self.target} Actual vs Forecast for {self.model_type} model.')
        plt.legend()
        plt.show()

        combined_rates = self.yrates + self.forecast
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
