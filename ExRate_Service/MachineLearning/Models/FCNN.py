from keras import Sequential
from keras.layers import Dense


class FCNN:
    def __init__(self, input_shape):
        self.model = Sequential()
        self.model.add(Dense(64, activation='relu', input_shape=input_shape))
        self.model.add(Dense(32, activation='relu'))
        self.model.add(Dense(1))
        self.model.compile(optimizer='adam', loss='mse')

    def get_model(self):
        return self.model
