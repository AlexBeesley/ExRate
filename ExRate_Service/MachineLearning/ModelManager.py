import numpy as np
from keras.callbacks import EarlyStopping
from keras.losses import mean_absolute_error

from DataPreprocessing.DataNormaliser import DataNormaliser
from MachineLearning.Models.FCNN import FCNN
from MachineLearning.Models.LSTM import LSTM


class ModelManager:
    def __init__(self, verbosity, model_type, year_rates, year_dates, base, target, lookback):
        self.lookback = lookback
        self.verbosity = verbosity
        self.model_type = model_type
        self.year_rates = year_rates
        self.year_dates = year_dates
        self.base = base
        self.target = target
        self.input_shape = (lookback, 1)
        self.normaliser = DataNormaliser()

    def select_model(self):
        if self.model_type == "FCNN":
            return FCNN(self.input_shape).get_model()
        elif self.model_type == "LSTM":
            return LSTM(self.input_shape).get_model()
        else:
            raise ValueError("Invalid model type. Choose either 'FCNN' or 'LSTM'.")

    def prepare_data(self):
        normalised_year_rates = self.normaliser.normalise(self.year_rates)
        x_train = []
        y_train = []
        for i in range(len(normalised_year_rates) - self.lookback):
            x_train.append(normalised_year_rates[i:i + self.lookback])
            y_train.append(normalised_year_rates[i + self.lookback])
        x_train, y_train = np.array(x_train), np.array(y_train)
        return x_train, y_train


    def train_model(self, model, x_train, y_train):
        early_stopping = EarlyStopping(monitor='val_loss', patience=20,
                                       restore_best_weights=True, verbose=self.verbosity)
        model.compile(loss=mean_absolute_error, optimizer='adam', metrics=['mae'])
        history = model.fit(x_train, y_train, epochs=100, batch_size=32, validation_split=0.1,
                            callbacks=[early_stopping], shuffle=False, verbose=self.verbosity)
        return history

    def forecast(self, model, x_train):
        predictions = []
        last_known = x_train[-1]
        for _ in range(7):
            prediction = model.predict(np.array([last_known]), verbose=self.verbosity)
            predictions.append(prediction[0][0])
            last_known = np.vstack((last_known[1:], prediction))
        predictions = np.array(predictions).reshape(-1, 1)
        return self.normaliser.denormalise(predictions).flatten().tolist()

    def evaluate(self, y_true, y_pred):
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)
        return mean_absolute_error(y_true, y_pred)

    def run(self):
        model = self.select_model()
        x_train, y_train = self.prepare_data()
        history = self.train_model(model, x_train, y_train)
        forecast = self.forecast(model, x_train)
        mae = self.evaluate(self.year_rates[-7:], forecast)
        return forecast, history, mae
