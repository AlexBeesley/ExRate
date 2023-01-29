from pandas import *

from DataFetching.ProcessDataFromResponse import ProcessDataFromResponse
from DataVisualisation import GenerateGraphFromData
from MachineLearning.LSTMModel import LSTMModel
from MachineLearning.NormalizeData import NormalizeData

data = read_csv("Assets/currency_codes.csv")
abvs = data['AlphabeticCode'].tolist()


def GetUserInputs():
    base = input("""Please provide a base currency: """)
    target = input("""Please provide a target currency: """)
    return base, target

print("Welcome to ExRate")
base, target = GetUserInputs()
if target in abvs and base in abvs:
    #GenerateGraphFromData.generateGraph(base, target)
    forecaster = ProcessDataFromResponse(base='USD', target='EUR')
    rates, dates = forecaster.process()
    print(rates)
    print(dates)
    normalizer = NormalizeData()
    normalized_rates = normalizer.normalize(rates)
    print(normalized_rates)
    input_shape = (7, 1)
    units = 64
    epochs = 100

    model = LSTMModel(input_shape, units)
    inputs = np.array([normalized_rates[i:i + 7] for i in range(len(normalized_rates) - 7)])
    inputs = inputs.reshape(-1, 7, 1)
    outputs = normalized_rates[7:]
    model.train(inputs, outputs, epochs)

    prediction = model.predict(inputs[-1].reshape(1, 7, 1))
    print(prediction)
    print("Accuracy: ", model.model.evaluate(inputs, outputs))



else:
    print("Try again; please provide a correct currency abbreviation. e.g. GBP, USD, EUR etc.")
