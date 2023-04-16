import React, { useRef, useEffect } from "react";
import Styles from "../Styles/home.module.scss";
import Chart from "chart.js/auto";

interface ChartComponentProps {
  baseCurrency: string;
  targetCurrency: string;
  data: any;
}

export default function ChartComponent({ baseCurrency, targetCurrency, data }: ChartComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        const chartElement = canvasRef.current;
        const existingChart = Chart.getChart(chartElement);
        if (existingChart) {
          existingChart.destroy();
        }
        const historicalData = Object.entries(data.historicalData).map(([date, rate]) => ({ x: date, y: rate }));
        const forecastData = Object.entries(data.forecast).map(([date, rate]) => ({ x: date, y: rate }));
        const chartData = {
          datasets: [
            {
              label: 'Historical Rates',
              data: historicalData,
              borderColor: 'green',
              fill: false,
            },
            {
              label: 'Forecast',
              data: forecastData,
              borderColor: 'red',
              fill: false,
            },
          ],
        };
        const options = {
          plugins: {
            title: {
              display: true,
              text: `${baseCurrency} to ${targetCurrency} exchange rate forecast`,
              responsive: true,
              maintainAspectRatio: false,
            }
          }
        };
        const chartConfig = {
          type: 'line',
          data: chartData,
          options: options,
        };
        const myChart = new Chart(chartElement, chartConfig);

        const resizeChart = () => {
          myChart.resize();
        };

        window.addEventListener('resize', resizeChart);

        return () => {
          window.removeEventListener('resize', resizeChart);
        };

      }, 10);
    }
  }, [baseCurrency, targetCurrency, data]);

  return <canvas className={Styles.chart} id="Chart" ref={canvasRef} />;
}
