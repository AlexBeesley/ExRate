import argparse
import os
import numpy as np
from pandas import read_csv
from DataFetching.ProcessDataFromResponse import ProcessDataFromResponse
from DataVisualisation import GenerateGraphFromData
from MachineLearning.DataNormaliser import DataNormaliser
from MachineLearning.ModelManager import ModelManager
from MachineLearning.Models.FCNN import FCNN
from MachineLearning.Models.LSTM import LSTM

# INFO log level messages not printed, set to 0 to enable INFO logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'


def main(base, target, model_type, has_args):
    abvs = read_currency_codes()

    if target in abvs and base in abvs:
        response_data = ProcessDataFromResponse(base=base, target=target)
        wrates, wdates, yrates, ydates = response_data.process()

        normaliser = DataNormaliser()
        normalised_rates = normaliser.normalise(yrates)

        inputs = np.array([normalised_rates[i:i + 7] for i in range(len(normalised_rates) - 7)])
        inputs = inputs.reshape(-1, 7, 1)
        outputs = normalised_rates[7:]

        if model_type.lower() == 'fcnn':
            selected_model = FCNN(inputs.shape)
        elif model_type.lower() == 'lstm':
            lstm_input_shape = (inputs.shape[1], inputs.shape[2])
            selected_model = LSTM(lstm_input_shape)
            inputs = np.reshape(inputs, (-1, inputs.shape[1], inputs.shape[2]))
        else:
            raise ValueError("Invalid model type. Please use 'FCNN' or 'LSTM'.")

        manager = ModelManager(base=base, target=target, model_type=model_type, model=selected_model.get_model())
        model, predictions, mae = manager.predict(inputs)

        last_input = inputs[-1]
        forecast = []
        for i in range(7):
            prediction = model.predict(last_input.reshape(1, 7, 1), verbose=0)
            prediction = normaliser.denormalise(prediction)
            forecast.append(prediction[0][0])
            last_input = np.roll(last_input, -1, axis=0)
            last_input[-1] = prediction

        forecast = [item if not hasattr(item, '__iter__') else [subitem for subitem in item] for item in forecast]

        if has_args:
            historical_data = dict(zip(ydates, yrates))
            forecast = dict(zip(wdates[-7:], forecast))
            print(historical_data)
            print(forecast)
        else:
            print("Accuracy: ", model.evaluate(inputs, outputs))
            print(f"Actual: {wrates}")
            print(f"Forecast: {forecast}")
            GenerateGraphFromData.generateGraphWithForecast(yrates, ydates, forecast, base, target)
    else:
        print("Try again; please provide a correct currency abbreviation. e.g. GBP, USD, EUR etc.")


def read_currency_codes():
    data = read_csv("Assets/currency_codes.csv")
    return data['AlphabeticCode'].tolist()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ExRate')
    parser.add_argument('-b', '--base', type=str, help='Base currency')
    parser.add_argument('-t', '--target', type=str, help='Target currency')
    parser.add_argument('-m', '--model', type=str, help='Model type (FCNN or LSTM)')
    args = parser.parse_args()

    if args.base and args.target and args.model:
        main(args.base.upper(), args.target.upper(), args.model.upper(), True)
    else:
        print("Welcome to ExRate")
        base = input("Please provide a base currency and target currency: ")
        target = input("Please provide a target currency: ")
        model_type = input("Please provide a model type (FCNN or LSTM): ")
        main(base.upper(), target.upper(), model_type.upper(), False)
