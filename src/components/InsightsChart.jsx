import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#FF6F61", "#6B7280"];

const InsightsChart = ({ expenseData, savingsTrend }) => {
  // Custom Tooltip for Pie Chart
  const renderPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{data.name}</p>
          <p>${data.value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Line Chart
  const renderLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{label}</p>
          <p>Savings: ${data.value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 w-full">
      {/* Category-wise Expense Distribution for Selected Month */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Expenses by Category (Selected Month)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true}
            >
              {expenseData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderPieTooltip} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Savings Trend (All Months) */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Savings Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={savingsTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              interval={0} 
            />
            <YAxis 
              label={{ value: 'Savings ($)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip content={renderLineTooltip} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#00C49F" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InsightsChart;