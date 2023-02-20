import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const ExchangeRateGraph = ({ data }) => {
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    // Convert the API response data to a format that can be used by the chart
    const formattedData = data.map((datum) => ({
      date: new Date(datum.date),
      rate: datum.rate,
    }));
    setFormattedData(formattedData);
  }, [data]);

  return (
    <LineChart width={800} height={400} data={formattedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default ExchangeRateGraph;
