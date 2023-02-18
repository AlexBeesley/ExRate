import tensorflow as tf


class LSTMModel(tf.keras.Model):
    def __init__(self, units=32, input_shape=(None, 1)):
        super(LSTMModel, self).__init__()
        self.lstm = tf.keras.layers.LSTM(units, return_sequences=True)
        self.dense = tf.keras.layers.Dense(7)

    def call(self, inputs):
        x = self.lstm(inputs)
        x = self.dense(x[:, -1, :])
        return x