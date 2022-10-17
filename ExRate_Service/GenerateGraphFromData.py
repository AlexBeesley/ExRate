import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import dates as mdates
import ProcessDataFromResponse


def generateGraph(base, target):
    rates, dates = ProcessDataFromResponse.processTimeSeries(base, target)

    dates = pd.to_datetime(dates)
    rates = pd.to_numeric(rates)
    fig, ax = plt.subplots(figsize=(12, 12))
    ax.plot(dates, rates)

    ax.set(xlabel="Dates",
           ylabel="Exchange Rates",
           title='Exchange Rates for {} to {} over the past year.'.format(base, target))

    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=1))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    plt.gcf().autofmt_xdate()

    plt.show()

