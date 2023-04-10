from keras import Sequential, regularizers
from keras.layers import Dense, Flatten, Dropout, BatchNormalization


class FCNN:
    def __init__(self, input_shape):
        self.model = Sequential()
        self.model.add(Flatten(input_shape=input_shape))
        self.model.add(Dense(128, activation='relu', kernel_regularizer=regularizers.l2(0.001)))
        self.model.add(BatchNormalization())
        self.model.add(Dropout(0.5))
        self.model.add(Dense(64, activation='relu', kernel_regularizer=regularizers.l2(0.001)))
        self.model.add(BatchNormalization())
        self.model.add(Dropout(0.5))
        self.model.add(Dense(32, activation='relu', kernel_regularizer=regularizers.l2(0.001)))
        self.model.add(BatchNormalization())
        self.model.add(Dense(1))
        self.model.compile(optimizer='adam', loss='mse', metrics=['mae'])

    def get_model(self):
        return self.model
