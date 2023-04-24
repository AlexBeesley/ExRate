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
  
        const lastDate = new Date(Object.keys(data.historicalData).pop());
        const sixMonthsBeforeLastDate = new Date(lastDate);
        sixMonthsBeforeLastDate.setMonth(sixMonthsBeforeLastDate.getMonth() - 6);
  
        const historicalData = Object.entries(data.historicalData)
        .filter(([date, rate]) => new Date(date) >= sixMonthsBeforeLastDate)
        .map(([date, rate]) => ({ x: date, y: rate }));
      const forecastData = Object.entries(data.forecast).map(([date, rate]) => ({ x: date, y: rate }));
      
      const lastHistoricalDataPoint = historicalData[historicalData.length - 1];
      const firstForecastDataPoint = forecastData[0];
      const historicalAndForecastData = [
        ...historicalData,
        {
          x: firstForecastDataPoint.x,
          y: lastHistoricalDataPoint.y,
        },
        ...forecastData,
      ];
      
      const chartData = {
        datasets: [
          {
            label: 'Historical Rates',
            data: historicalAndForecastData,
            borderColor: '#009F76',
            order: 1
          },
          {
            label: 'Forecast',
            data: forecastData,
            borderColor: '#937CE3',
            order: 0
          },
        ],
      };
      
      const options = {
        plugins: {
          title: {
            display: true,
            text: `Exchange rate forecast for ${baseCurrency} to ${targetCurrency} `,
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
