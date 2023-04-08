import numpy as np
from keras.models import Sequential
from keras.layers import Dense
from sklearn.preprocessing import MinMaxScaler
from keras.callbacks import EarlyStopping
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

from MachineLearning.Models.FCNN import FCNN
from MachineLearning.Models.LSTM import LSTM


class ModelManager:

    def __init__(self, base, target, model_type, model=None, units=64, input_shape=(7, 1), epochs=50, batch_size=32):
        self.base = base
        self.target = target
        self.model_type = model_type.lower()
        self.units = units
        self.input_shape = input_shape
        self.epochs = epochs
        self.batch_size = batch_size
        self.scaler = MinMaxScaler()
        self.model = model

    def process_data(self, rates):
        rates = np.array(rates).reshape(-1, 1)
        rates = self.scaler.fit_transform(rates)
        sequences = []
        targets = []
        for i in range(7, len(rates)):
            sequences.append(rates[i-7:i])
            targets.append(rates[i])
        sequences = np.array(sequences)
        targets = np.array(targets)
        tscv = TimeSeriesSplit(n_splits=5)
        for train_index, test_index in tscv.split(sequences):
            X_train, X_test = sequences[train_index], sequences[test_index]
            y_train, y_test = targets[train_index], targets[test_index]
        return X_train, X_test, y_train, y_test

    def create_model(self):
        if self.model is None:
            if self.model_type == 'fcnn':
                self.model = FCNN(self.input_shape).get_model()
            elif self.model_type == 'lstm':
                self.model = LSTM(self.input_shape).get_model()
        return self.model

    def train_model(self, X_train, X_test, y_train, y_test, model):
        history = model.fit(X_train,
                            y_train,
                            epochs=self.epochs,
                            batch_size=self.batch_size,
                            validation_data=(X_test, y_test),
                            callbacks=[EarlyStopping(monitor='val_loss', patience=10)],
                            verbose=0)
        return model, history

    def predict(self, inputs):
        X_train, X_test, y_train, y_test = self.process_data(inputs)
        model = self.create_model()
        model, history = self.train_model(X_train, X_test, y_train, y_test, model)

        test_predictions = model.predict(X_test)
        mae = mean_absolute_error(self.scaler.inverse_transform(y_test),
                                  self.scaler.inverse_transform(test_predictions))

        forecast = []
        input_sequence = inputs[-1].reshape(1, 7, 1)
        for i in range(7):
            prediction = model.predict(input_sequence, verbose=0)
            forecast.append(prediction[0][0])
            input_sequence = np.roll(input_sequence, -1)
            input_sequence[0, -1, 0] = prediction

        forecast = self.scaler.inverse_transform(np.array(forecast).reshape(-1, 1))

        return model, forecast, mae






