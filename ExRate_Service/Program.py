import argparse
import os
import numpy as np
import tensorflow as tf

from pandas import *
from DataFetching.ProcessDataFromResponse import ProcessDataFromResponse
from DataVisualisation import GenerateGraphFromData
from MachineLearning.LSTMModel import LSTMModel
from MachineLearning.NormalizeData import NormalizeData

# INFO log level messages not printed, set to 0 to enable INFO logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'

data = read_csv("Assets/currency_codes.csv")
abvs = data['AlphabeticCode'].tolist()

input_shape = (7, 1)
units = 64
epochs = 100
batch_size = 16


def GetUserInputs():
    base = input("""Please provide a base currency: """)
    target = input("""Please provide a target currency: """)
    return base, target


def run_app(base, target, hasArgs):
    if target in abvs and base in abvs:
        forecaster = ProcessDataFromResponse(base=base, target=target)
        wrates, wdates, yrates, ydates = forecaster.process()

        normalizer = NormalizeData()
        normalized_rates = normalizer.normalize(yrates)

        model = LSTMModel(units=units, input_shape=input_shape)
        inputs = np.array([normalized_rates[i:i + 7] for i in range(len(normalized_rates) - 7)])
        inputs = inputs.reshape(-1, 7, 1)
        outputs = normalized_rates[7:]
        print(inputs.shape)

        model.compile(loss='mean_squared_error', optimizer='adam')
        model.fit(inputs, outputs, epochs=epochs, batch_size=batch_size, verbose=0)

        prediction = model.predict(inputs[-1].reshape(1, 7, 1), verbose=0)
        prediction = normalizer.denormalize(prediction)
        prediction = [item for sublist in prediction for item in sublist]

        if hasArgs:
            historicalData = dict(zip(ydates, yrates))
            forecast = dict(zip(wdates, prediction))
            print(historicalData)
            print(forecast)
        else:
            print("Accuracy: ", model.evaluate(inputs, outputs))
            print(f"Actual: {wrates}")
            print(f"Forecast: {prediction}")
            GenerateGraphFromData.generateGraphWithForecast(yrates, ydates, prediction, base, target)
    else:
        print("Try again; please provide a correct currency abbreviation. e.g. GBP, USD, EUR etc.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ExRate')
    parser.add_argument('-b', '--base', type=str, help='Base currency')
    parser.add_argument('-t', '--target', type=str, help='Target currency')
    args = parser.parse_args()

    if args.base and args.target:
        run_app(args.base.upper(), args.target.upper(), True)
    else:
        print("Welcome to ExRate")
        base, target = GetUserInputs()
        run_app(base.upper(), target.upper(), False)
