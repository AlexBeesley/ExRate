import argparse
import os

from pandas import read_csv
from DataPreprocessing.GenerateGraphFromData import GenerateGraphsFromData
from DataPreprocessing.ProcessDataFromResponse import ProcessDataFromResponse
from MachineLearning.ModelManager import ModelManager
from Utils.PercentageDifferenceCalculator import PercentageDifferenceCalculator

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'


def read_currency_codes():
    data = read_csv("Assets/currency_codes.csv")
    return data['AlphabeticCode'].tolist()


def display_results(has_args, year_dates, year_rates, week_dates, week_rates, model_type, history, forecast, base,
                    target):
    if has_args:
        historical_data = dict(zip(year_dates, year_rates))
        forecast_data = dict(zip(week_dates[-7:], forecast))
        print(historical_data)
        print(forecast_data)
    else:
        print(f"Actual: {week_rates}")
        print(f"Forecast: {forecast}")
        graphs = GenerateGraphsFromData(model_type=model_type,
                                        yrates=year_rates,
                                        wrates=week_rates,
                                        ydates=year_dates,
                                        wdates=week_dates,
                                        base=base,
                                        target=target,
                                        history=history,
                                        forecast=forecast)
        calculator = PercentageDifferenceCalculator()
        diff_percentage = calculator.percentage_difference(forecast, week_rates)
        print(f"Percentage difference: {diff_percentage:.2f}%")
        graphs.display_evaluation_graphs()


def main(base, target, model_type, has_args):
    verbosity = 1
    if has_args:
        verbosity = 0
    processData = ProcessDataFromResponse(base=base, target=target)
    week_rates, week_dates, year_rates, year_dates = processData.process()
    lookback = 7
    modelManager = ModelManager(verbosity, model_type, year_rates, year_dates, base, target, lookback)
    forecast, history, mae = modelManager.run()
    display_results(has_args, year_dates, year_rates, week_dates, week_rates,
                    model_type, history, forecast, base, target)


def process_args(args, has_args):
    abvs = read_currency_codes()
    if has_args:
        base, target, model_type = args.base.upper(), args.target.upper(), args.model.upper()
    else:
        base = input("Please provide a base currency: ").upper()
        target = input("Please provide a target currency: ").upper()
        model_type = input("Please provide a model type (FCNN or LSTM): ").upper()
    if model_type not in ['FCNN', 'LSTM']:
        raise ValueError("Invalid model type. Please use 'FCNN' or 'LSTM'.")
    if target not in abvs and base not in abvs:
        raise ValueError("Invalid currency abbreviation. Please provide a correct 3-letter currency abbreviation. "
                         "e.g. GBP, USD, EUR etc.")
    main(base, target, model_type, has_args)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ExRate Service')
    parser.add_argument('-b', '--base', type=str, help='Base currency')
    parser.add_argument('-t', '--target', type=str, help='Target currency')
    parser.add_argument('-m', '--model', type=str, help='Model type (FCNN or LSTM)')
    args = parser.parse_args()

    if args.base and args.target and args.model:
        process_args(args, has_args=True)
    else:
        print("Welcome to ExRate")
        process_args(None, has_args=False)
