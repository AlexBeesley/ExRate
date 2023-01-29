import numpy as np
from sklearn.preprocessing import MinMaxScaler

class NormalizeData:
    def __init__(self):
        self.scaler = MinMaxScaler()

    def normalize(self, rates):
        rates_array = np.array(rates).reshape(-1, 1)
        return self.scaler.fit_transform(rates_array)
