from keras import Sequential, regularizers
from keras.layers import LSTM as KerasLSTM, Dense, Dropout
from keras.optimizers import RMSprop


class LSTM:
    def __init__(self, input_shape):
        self.model = Sequential()
        self.model.add(KerasLSTM(64, input_shape=input_shape, activation='tanh', kernel_regularizer=regularizers.l2(0.001), return_sequences=True))
        self.model.add(KerasLSTM(32, activation='tanh', kernel_regularizer=regularizers.l2(0.001), return_sequences=True))
        self.model.add(KerasLSTM(16, activation='tanh', kernel_regularizer=regularizers.l2(0.001)))
        self.model.add(Dense(1))
        self.model.compile(optimizer=RMSprop(learning_rate=0.0001), loss='mse', metrics=['mae'])

    def get_model(self):
        return self.model

