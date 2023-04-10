import argparse
import os
import numpy as np
import tensorflow as tf
from pandas import read_csv
from DataPreprocessing.ProcessDataFromResponse import ProcessDataFromResponse
from DataPreprocessing.GenerateGraphFromData import GenerateGraphFromData
from DataPreprocessing.DataNormaliser import DataNormaliser
from MachineLearning.ModelManager import ModelManager
from MachineLearning.Models.FCNN import FCNN
from MachineLearning.Models.LSTM import LSTM

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'


def read_currency_codes():
    data = read_csv("Assets/currency_codes.csv")
    return data['AlphabeticCode'].tolist()


def get_model(model_type, input_shape):
    if model_type.lower() == 'fcnn':
        return FCNN(input_shape)
    elif model_type.lower() == 'lstm':
        return LSTM(input_shape)
    else:
        raise ValueError("Invalid model type. Please use 'FCNN' or 'LSTM'.")


def process_data(base, target):
    response_data = ProcessDataFromResponse(base=base, target=target)
    wrates, wdates, yrates, ydates = response_data.process()
    return wrates, wdates, yrates, ydates


def normalise_and_prepare_data(yrates):
    normaliser = DataNormaliser()
    normalised_rates = normaliser.normalise(yrates)

    inputs = np.array([normalised_rates[i:i + 7] for i in range(len(normalised_rates) - 7)])
    inputs = inputs.reshape(-1, 7, 1)
    outputs = normalised_rates[7:]

    return inputs, outputs, normaliser


def generate_forecast(model, last_input, normaliser):
    forecast = []
    for i in range(7):
        prediction = model.predict(last_input.reshape(1, 7, 1), verbose=0)
        prediction = normaliser.denormalise(prediction)
        forecast.append(prediction[0][0])
        last_input = np.roll(last_input, -1, axis=0)
        last_input[-1] = prediction

    return forecast


def display_results(has_args, wrates, forecast, inputs, outputs, ydates, yrates, wdates, model, base, target):
    if has_args:
        historical_data = dict(zip(ydates, yrates))
        forecast = dict(zip(wdates[-7:], forecast))
        print(historical_data)
        print(forecast)
    else:
        print("Accuracy: ", model.evaluate(inputs, outputs))
        print(f"Actual: {wrates}")
        print(f"Forecast: {forecast}")
        graph = GenerateGraphFromData(yrates, ydates, base, target)
        graph.generateGraphWithForecast(forecast)


def main(base, target, model_type, has_args):
    abvs = read_currency_codes()

    if target in abvs and base in abvs:
        wrates, wdates, yrates, ydates = process_data(base, target)
        inputs, outputs, normaliser = normalise_and_prepare_data(yrates)
        selected_model = get_model(model_type, (inputs.shape[1], inputs.shape[2]))
        manager = ModelManager(base=base, target=target, model_type=model_type, model=selected_model.get_model())
        model, predictions, mae = manager.predict(inputs)
        forecast = generate_forecast(model, inputs[-1], normaliser)
        display_results(has_args, wrates, forecast, inputs, outputs, ydates, yrates, wdates, model, base, target)
    else:
        raise ValueError("Invalid currency abbreviation. Please provide a correct 3-letter currency abbreviation. "
                         "e.g. GBP, USD, EUR etc.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ExRate Service')
    parser.add_argument('-b', '--base', type=str, help='Base currency')
    parser.add_argument('-t', '--target', type=str, help='Target currency')
    parser.add_argument('-m', '--model', type=str, help='Model type (FCNN or LSTM)')
    args = parser.parse_args()

    if args.base and args.target and args.model:
        tf.get_logger().setLevel('ERROR')
        main(args.base.upper(), args.target.upper(), args.model.upper(), True)
    else:
        print("Welcome to ExRate")
        base = input("Please provide a base currency: ")
        target = input("Please provide a target currency: ")
        model_type = input("Please provide a model type (FCNN or LSTM): ")
        main(base.upper(), target.upper(), model_type.upper(), False)