import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import { getChartData } from "../../services/adminService";

export default function TransactionChart() {

  const [data, setData] = useState([]);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {

    try {

      const response = await getChartData();

      setData(response.data);

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8">

      <h2 className="text-2xl font-bold text-white">

        Last 7 Days Transactions

      </h2>

      <div className="h-80 mt-8">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid stroke="#333" />

            <XAxis dataKey="label" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#7C5CFF"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}