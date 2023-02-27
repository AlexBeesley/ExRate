import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from keras.callbacks import EarlyStopping
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error


class Forecaster:

    def __init__(self, base, target, units=64, input_shape=(7, 1), epochs=50, batch_size=32):
        self.base = base
        self.target = target
        self.units = units
        self.input_shape = input_shape
        self.epochs = epochs
        self.batch_size = batch_size
        self.scaler = MinMaxScaler()

    def process_data(self, rates, dates):
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

    def build_model(self):
        model = Sequential()
        model.add(LSTM(self.units, input_shape=self.input_shape))
        model.add(Dropout(0.2))
        model.add(Dense(1))
        model.compile(loss='mean_absolute_error', optimizer='adam')
        return model

    def train_model(self, X_train, X_test, y_train, y_test):
        model = self.build_model()
        early_stopping = EarlyStopping(monitor='val_loss', patience=10)
        history = model.fit(X_train, y_train, epochs=self.epochs, batch_size=self.batch_size, validation_data=(X_test, y_test), callbacks=[early_stopping], verbose=0)
        return model, history

    def predict(self, rates):
        X_train, X_test, y_train, y_test = self.process_data(rates, None)
        model, history = self.train_model(X_train, X_test, y_train, y_test)
        predictions = model.predict(X_test)
        predictions = self.scaler.inverse_transform(predictions)
        y_test = self.scaler.inverse_transform(y_test)
        mae = mean_absolute_error(y_test, predictions)
        return predictions, mae
