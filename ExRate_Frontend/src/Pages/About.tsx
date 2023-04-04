import Styles from '../Styles/about.module.scss'

export default function About() {
  return (
    <div className={Styles.aboutContent}>
      <h1>ExRate</h1>
      <h3></h3>
      <p className={Styles.subheading}><strong>CI601 ~ The Computing Project</strong> (2022 Semesters 1 and 2)</p>

      <h2>Overview</h2>
      <p>This project aims to answer the following academic question:
        &#39;Can Machine Learning forecast exchange rates within a 5% margin of error?&#39;</p>
      <p>The three components of this project are the following:</p>
      <ul>
        <li>ExRate Service - A Python script which gets exchange rates from a third-party API and uses this data to train an LSTM model via TensorFlow and Keras.</li>
        <li>ExRate API - A .NET API which calls the Service script to get exchange rate forecast data which is returned as JSON.</li>
        <li>ExRate Frontend - A React SPA which is built with TypeScript and WebPack. It consumes the ExRate API and demonstrates how it can be used.</li>
      </ul>
      <p>While the purpose of this project is to answer the academic question, this project was built using Agile industry-standard software development techniques and demonstrates the understanding of the candidate across a variety of frameworks, languages and technologies.</p>

      <h2>ExRate Service</h2>
      <p>This service is responsible for collecting exchange rate data, this data is collected from apilayer.com and its documentation is available <a href="https://apilayer.com/marketplace/exchangerates_data-api?live_demo=show">here</a>. Once the Data is collected, the service will automatically train an LSTM model using TensorFlow and Keras, more information will be available on how that is handled in the CI601 report produced as part of this project.</p>
      <h3>Requirments</h3>
      <ul>
        <li>Python 3.10.9 with pip</li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Required Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>numpy</td>
            <td>1.23.4 &lt; 2.0.0</td>
          </tr>
          <tr>
            <td>pandas</td>
            <td>1.5.1 &lt; 2.0.0</td>
          </tr>
          <tr>
            <td>requests</td>
            <td>2.28.1 &lt; 3.0.0</td>
          </tr>
          <tr>
            <td>python-dotenv</td>
            <td>0.21.0 &lt; 1.0.0</td>
          </tr>
          <tr>
            <td>tensorflow</td>
            <td>2.8.0 &lt; 3.0.0</td>
          </tr>
          <tr>
            <td>scikit-learn</td>
            <td>1.2.0 &lt; 2.0.0</td>
          </tr>
          <tr>
            <td>keras</td>
            <td>2.11.0 &lt; 3.0.0</td>
          </tr>
          <tr>
            <td>matplotlib</td>
            <td>3.6.1 &lt; 4.0.0</td>
          </tr>
        </tbody>
      </table>
      <p>use <code>pip install [Package Name]==[Required Version]</code> to install the required packages.</p>
      <h3>Usage</h3>
      <p>From the <code>/ExRate_Service</code> directory, run the script with user input from the command line use:</p>
      <p><code>py Program.py</code></p>
      <p>and without user input, run:</p>
      <p><code>py Program.py -b [BASE_CURRENCY] -t [TARGET_CURRENCY]</code></p>
      <p>Where <code>BASE_CURRENCY</code> and <code>TARGET_CURRENCY</code> are  3-letter currency codes.</p>
      <p>A list of acceptable currencies can be found in the <code>ExRate_Service/Assets/currency_codes.csv</code> file.</p>

      <h2>ExRate API</h2>
      <p>This component is responsible for running the ExRate_Service Python script and returning the result as JSON. It is a .NET 6 API service which is set up to run locally or inside a Docker container.</p>
      <h3>Running locally</h3>
      <h4>Requirments</h4>
      <ul>
        <li>.NET 6 SDK</li>
        <li>ASP.NET core</li>
      </ul>
      <h4>Setup</h4>
      <p>To start the API server, run the following from the <code>/ExRate_API/ExRate_API</code> directory:</p>
      <p><code>dotnet run</code></p>
      <h3>Running inside a Docker container</h3>
      <h4>Requirments</h4>
      <ul>
        <li>Docker 20.10.21^</li>
      </ul>
      <h4>Setup</h4>
      <p>Before building the container, ensure you have Docker installed and Docker Desktop running.</p>
      <p>From the root folder, build the container with the following command:</p>
      <p><code>docker build -t exrate .</code></p>
      <p>then run the following command to start the container:</p>
      <p><code>docker run -ti --rm -p 8081:80 exrate</code></p>
      <p>This will run the API inside the Docker container, which can be accessed locally on port 8081. To assign the API to another port, just change the port used in the above command.</p>
      <h3>Usage</h3>
      <p>Whether you are running the API in docker or locally, to make a request use the following URL schema:</p>
      <p><code>http://localhost:[PORT]/api/GetExRateForecast/[BASE_CURRENCY]&amp;[TARGET_CURRENCY</code></p>
      <p>Where <code>PORT</code> is the port being used; <code>BASE_CURRENCY</code> and <code>TARGET_CURRENCY</code> are 3-letter currency codes. For example: <code>http://localhost:8080/api/GetExRateForecast/USD&amp;EUR</code></p>

      <h2>ExRate Frontend</h2>
      <p>This is a Single-Page App built using the popular JavaScript framework, React. Its aim is to demonstrate how the ExRate API can be used.</p>
      <h3>Requirements</h3>
      <ul>
        <li>node.js 16.7.1^</li>
        <li>yarn 1.22.19^</li>
      </ul>
      <h3>Usage</h3>
      <p>From the <code>/ExRate_Frontend</code> directory, you can load dependencies simplicity with:</p>
      <p><code>yarn</code></p>
      <p>Then to run the site locally:</p>
      <p><code>yarn start</code></p>
      <p>This should open the site in the browser by default, but you can also access it via <code>http://localhost:8080/</code>.</p>
      <p>and to build the site:</p>
      <p><code>yarn build</code></p>
    </div>
  )
}
