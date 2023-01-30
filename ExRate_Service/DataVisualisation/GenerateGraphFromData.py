import datetime

import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import dates as mdates


def generateGraph(rates, dates, base, target):
    dates = pd.to_datetime(dates)
    rates = pd.to_numeric(rates)
    fig, ax = plt.subplots(figsize=(12, 12))
    ax.plot(dates, rates)

    ax.set(xlabel="Dates",
           ylabel="Exchange Rates",
           title=f"Exchange Rates for {base} to {target} over the past year.")

    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=1))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    plt.gcf().autofmt_xdate()

    plt.show()


def generateGraphWithForecast(rates, dates, forecast, base, target):
    dates = pd.to_datetime(dates + [datetime.date.today() + datetime.timedelta(days=i) for i in range(1, 8)])
    rates = pd.to_numeric(rates + forecast)

    fig, ax = plt.subplots(figsize=(12, 12))
    ax.plot(dates[:-7], rates[:-7], label="Exchange Rates")
    ax.plot(dates[-7:], rates[-7:], label="7-day Forecast", color='green')

    ax.set(xlabel="Dates",
           ylabel="Exchange Rates",
           title=f"Exchange Rates for {base} to {target} over the past year with 7-day forecast.")

    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=1))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    plt.gcf().autofmt_xdate()
    plt.legend()

    plt.show()


