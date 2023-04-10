from keras import Sequential
from keras.layers import LSTM as KerasLSTM, Dense


class LSTM:
    def __init__(self, input_shape):
        self.model = Sequential()
        self.model.add(KerasLSTM(64, activation='tanh', input_shape=input_shape, return_sequences=True))
        self.model.add(KerasLSTM(32, activation='tanh', return_sequences=False))
        self.model.add(Dense(32, activation='relu'))
        self.model.add(Dense(1))
        self.model.compile(optimizer='adam', loss='mse')

    def get_model(self):
        return self.model
