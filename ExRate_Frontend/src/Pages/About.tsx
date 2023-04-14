import Styles from '../Styles/about.module.scss'

export default function About() {
  return (
    <div className={Styles.aboutContent}>
      <h1>CI601 The Computing Project</h1>
      <p>2022 Semesters 1 and 2</p>
      <h2>ExRate</h2>
      <p>This project aims to answer the following academic question: ‘Can
        Machine Learning forecast exchange rates within a 5% margin of
        error?’</p>
      <p>The three components of this project are the following:</p>
      <ul>
        <li>ExRate Service
          <ul>
            <li>A Python script which gets exchange rates from a third-party API and uses this data to train an LSTM model via TensorFlow and Keras.</li>
          </ul>
        </li>
        <li>ExRate API
          <ul>
            <li>A .NET API which calls the Service script to get exchange rate forecast data which is returned as JSON.</li>
          </ul>
        </li>
        <li>ExRate Frontend
          <ul>
            <li>A React SPA which is built with TypeScript and WebPack. It consumes the ExRate API and demonstrates how it can be used.</li>
          </ul>
        </li>
      </ul>
      <p>While the purpose of this project is to answer the academic question,
        this project was built using Agile industry-standard software
        development techniques and demonstrates the understanding of the
        candidate across a variety of frameworks, languages and
        technologies.</p>
      <h2>ExRate Service</h2>
      <p>This service is responsible for collecting exchange rate data, this
        data is collected from apilayer.com and its documentation is available <a
          href="https://apilayer.com/marketplace/exchangerates_data-api?live_demo=show">
          here
        </a>.</p>
      <p>This service offers two types of models, a Fully Connected Neural
        Network (FCNN) and a Long Short-Term Memory (LSTM) model, for the
        prediction task.</p>
      <h3>Requirments</h3>
      <table>
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Required Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Python</td>
            <td>&gt;= 3.10.9</td>
          </tr>
          <tr>
            <td>numpy</td>
            <td>&gt;= 1.23.4</td>
          </tr>
          <tr>
            <td>pandas</td>
            <td>&gt;= 1.5.1</td>
          </tr>
          <tr>
            <td>requests</td>
            <td>&gt;= 2.28.1</td>
          </tr>
          <tr>
            <td>python-dotenv</td>
            <td>&gt;= 0.21.0</td>
          </tr>
          <tr>
            <td>tensorflow</td>
            <td>&gt;= 2.8.0</td>
          </tr>
          <tr>
            <td>scikit-learn</td>
            <td>&gt;= 1.2.0</td>
          </tr>
          <tr>
            <td>keras</td>
            <td>&gt;= 2.11.0</td>
          </tr>
          <tr>
            <td>matplotlib</td>
            <td>&gt;= 3.6.1</td>
          </tr>
        </tbody>
      </table>
      <p>Use <code>pip install [Package Name]==[Required Version]</code> to
        install the required packages.</p>
      <h3 id="usage">Usage</h3>
      <p>First, make sure to obtain an API key for the exchange rates data
        from a service like apilayer. Add your API key to a <code>.env</code> file
        in the project’s root directory:</p>
      <code>API_KEY=YOUR_API_KEY_HERE</code>
      <p>Run the <code>Program.py</code> script with the required arguments:</p>
      <code>python Program.py -b BASE_CURRENCY -t TARGET_CURRENCY -m MODEL_TYPE</code>
        <ul>
          <li><code>BASE_CURRENCY</code>: The 3-letter code for the base currency
            (e.g., USD, GBP, EUR).</li>
          <li><code>TARGET_CURRENCY</code>: The 3-letter code for the target currency
            (e.g., USD, GBP, EUR).</li>
          <li><code>MODEL_TYPE</code>: The type of model to use for prediction.
            Use <code>FCNN</code> for Fully Connected Neural Network or
            <code>LSTM</code> for Long Short-Term Memory model.</li>
        </ul>
        <p>For example:</p>
        <code>python Program.py -b USD -t EUR -m FCNN</code>
        <p>Alternatively, you can run the <code>Program.py</code> script without
          arguments and provide the required information when prompted:</p>
        <code>python Program.py</code>
        <pre className={Styles.codeBlock}>
          Welcome to ExRate<br />
          Please provide a base currency: USD<br />
          Please provide a target currency: EUR<br />
          Please provide a model type (FCNN or LSTM): FCNN
        </pre>
        
        <p>The script will display the historical exchange rates data, the
          predicted exchange rates for the next week, and the model’s accuracy. If
          running without command line arguments, a graph will also be displayed
          showing the historical data and the predicted values.</p>
        <h2>ExRate API</h2>
        <p>This component is responsible for running the ExRate_Service Python
          script and returning the result as JSON. It is a .NET 6 API service
          which is set up to run locally or inside a Docker container.</p>
        <h3>Running locally</h3>
        <h4>Requirments</h4>
        <ul>
          <li>.NET 6 SDK</li>
        </ul>
        <h4>Setup</h4>
        <p>First open the
          <code>appsettings.json</code> file, then replace the paths with the
          following:</p>
        <pre className={Styles.codeBlock}>
          {`"LocalConfig": {
  "PythonExecutablePath": "/path/to/your/python3.9",
  "ScriptPath": "/path/to/ExRate/ExRate_Service/Program.py"
}`}
        </pre>
        <p>To start the API server, run the following commands from the <code>/ExRate_API/ExRate_API</code> directory:</p>
        <code>dotnet restore</code>
        <code>dotnet run</code>
        <h3>Running inside a Docker
          container</h3>
        <h4>Requirments</h4>
        <ul>
          <li>Docker 20.10.21 or higher ### Setup Before building the container,
            ensure you have Docker installed and Docker Desktop running.</li>
        </ul>
        <p>From the root folder, build the container with the following
          command:</p>
        <p><code>docker build -t exrate .</code></p>
        <p>then run the following command to start the container:</p>
        <p><code>docker run -ti --rm -p PORT:80 exrate</code></p>
        <p>Where <code>PORT</code> is the port number you want to expose. Then
          the API will be accessible on <code>http://localhost:PORT</code> (e.g
          http://localhost:8080)</p>
        <h3>API Endpoints</h3>
        <code>POST /api/GetExRateForecast</code>
        <p>With the following query parameters: - <code>baseCurrency</code> -
          the base currency (e.g. <code>USD</code>) - <code>targetCurrency</code>
          - the target currency (e.g. <code>GBP</code>) - <code>modelType</code> -
          the model type (e.g. <code>LSTM</code>)</p>
        <p>Putting this together would result in:</p>
        <code>POST /api/GetExRateForecast?ites.net/api/GetExRateForecast?baseCurrency=USD&amp;targetCurrency=GBP&amp;modelType=LSTM</code>
        <p>This request will return a JSON response containing a process token,
          in this format:</p>
          <pre className={Styles.codeBlock}>
          {`{
    "token": GUID
}`}
        </pre>
        <p>Note that each <code>POST</code> request will return its own guid and
          start a separate process.</p>
        <p>Take this <code>GUID</code> (which will look something like
          <code>c76b2ddd-f5c7-4e09-b147-5ec8f4137429</code>) and apply it to the
          following request to get the forecast once the model has been built, for
          example:</p>
        <code>GET /api/GetExRateForecast/c76b2ddd-f5c7-4e09-b147-5ec8f4137429</code>
        <p>This will return <code>404 Not Found</code> until the forecast has
          been processed - which usually takes between 2 and 5 minutes to
          complete.</p>
        <p>Once the forecast has been processed, it will be returned as a json
          with <code>200 OK</code>. Here is an example of how this response
          looks:</p>
          <pre className={Styles.codeBlock}>
          {`{
  "historicalData": {
    "2022-04-06": 0.765115,
    "2022-04-07": 0.76518,
    "2022-04-08": 0.767142,
    "2022-04-09": 0.768149,
	. . .
    "2023-04-02": 0.813715,
    "2023-04-03": 0.80499,
    "2023-04-04": 0.80015,
    "2023-04-05": 0.8024
  },
  "forecast": {
    "2023-04-06": 0.8083399,
    "2023-04-07": 0.8152494,
    "2023-04-08": 0.8184916,
    "2023-04-09": 0.8095991,
    "2023-04-10": 0.8039013,
    "2023-04-11": 0.8244032,
    "2023-04-12": 0.86308336
  }
}`}
        </pre>
        <p><code>historicalData</code> containes the exchange rates of the
          selected currencies for the past year and <code>forecast</code> contains
          the the 7-day forecast.</p>
        <h2>ExRate Frontend</h2>
        <p>This is a Single-Page App built using the popular JavaScript
          framework, React. Its aim is to demonstrate how the ExRate API can be
          used.</p>
        <h3>Requirements</h3>
        <ul>
          <li>node.js 16.7.1 or higher</li>
          <li>yarn 1.22.19 or higher</li>
        </ul>
        <h3>Usage</h3>
        <p>From the <code>/ExRate_Frontend</code> directory, you can load dependencies
          simplicity with:</p>
        <p><code>yarn</code></p>
        <p>Then to run the site locally:</p>
        <p><code>yarn start</code></p>
        <p>This should open the site in the browser by default, but you can also
          access it via <code>http://localhost:8080/</code>.</p>
        <p>To build the site:</p>
        <code>yarn build</code>
    </div>
  )
}
