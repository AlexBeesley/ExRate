import tensorflow as tf

class LSTMModel:
    def __init__(self, input_shape, units):
        self.model = tf.keras.Sequential()
        self.model.add(tf.keras.layers.LSTM(units, input_shape=(input_shape[1], input_shape[2])))
        self.model.add(tf.keras.layers.Dense(1))
        self.model.compile(optimizer='adam', loss='mean_squared_error')

    def train(self, inputs, outputs, epochs, batch_size):
        self.model.fit(inputs, outputs, epochs=epochs, batch_size=batch_size, verbose=2)

    def predict(self, inputs, prediction_length):
        return self.model.predict(inputs, verbose=0)[:, 0][-prediction_length:]
