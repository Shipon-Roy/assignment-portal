"use client";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#FFBB28", "#00C49F", "#FF4444"];

export default function StatusChart({ data }) {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="count" nameKey="status" outerRadius={100} label>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
