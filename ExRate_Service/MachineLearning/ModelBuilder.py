from keras.models import Sequential


class ModelBuilder:
    def __init__(self, units=32, input_shape=(None, 1)):
        self.units = units
        self.input_shape = input_shape

    def build_model(self, model_architecture):
        model = Sequential()
        model.add(model_architecture)
        model.compile(loss='mean_absolute_error', optimizer='adam')
        return model
