import React, { FC } from 'react';
import { Line } from 'react-chartjs-2';

interface GraphProps {
  data: {
    [date: string]: {
      [rate: string]: number;
    };
  };
}

export default function Graph({ data }: GraphProps): JSX.Element {
  const dates = Object.keys(data);
  const firstKeyValues = dates.map((date) => data[date]['key1']);
  const secondKeyValues = dates.map((date) => data[date]['key2']);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Key 1',
        data: firstKeyValues,
        fill: false,
        borderColor: 'red',
      },
      {
        label: 'Key 2',
        data: secondKeyValues,
        fill: false,
        borderColor: 'green',
      },
    ],
  };

  return <Line data={chartData} />;
}
