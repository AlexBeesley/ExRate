import numpy as np

from sklearn.preprocessing import MinMaxScaler


class DataNormaliser:
    def __init__(self):
        self.scaler = MinMaxScaler()

    def normalise(self, rates):
        rates_array = np.array(rates).reshape(-1, 1)
        return self.scaler.fit_transform(rates_array)

    def denormalise(self, rates):
        return self.scaler.inverse_transform(rates)
