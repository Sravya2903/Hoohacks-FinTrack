import React, { useState, useEffect } from "react";
import InsightsChart from "../components/InsightsChart";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const variableExpenses=[];
const fixedIncome=[];
const fixedExpensesTotal=[];
function InsightsPage() {
  const [expenseData, setExpenseData] = useState([]);
  const [savingsTrend, setSavingsTrend] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("March"); // Default to March
  const [geminiResponse, setGeminiResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch financial data from backend
  useEffect(() => {
    const fetchFinancialData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setError("No user email found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // Fetch fixed expenses
        const fixedResponse = await fetch(
          `http://localhost:3070/api/fixed-expenses?email=${encodeURIComponent(
            email
          )}`,
          {
            credentials: "include",
          }
        );
        if (!fixedResponse.ok) {
          const errorData = await fixedResponse.json();
          throw new Error(errorData.error || "Failed to fetch fixed expenses");
        }
        const fixedData = await fixedResponse.json();
        const fixedIncome = fixedData.data ? fixedData.data.income : 0;
        const fixedExpensesTotal = fixedData.data
          ? fixedData.data.expenses.reduce(
              (sum, exp) => sum + (exp.amount || 0),
              0
            )
          : 0;

        // Fetch variable expenses
        const variableResponse = await fetch(
          `http://localhost:3070/api/variable-expenses?email=${encodeURIComponent(
            email
          )}`,
          {
            credentials: "include",
          }
        );
        if (!variableResponse.ok) {
          const errorData = await variableResponse.json();
          throw new Error(
            errorData.error || "Failed to fetch variable expenses"
          );
        }
        const variableData = await variableResponse.json();
        const variableExpenses = variableData.expenses || [];

        // Process data for Pie Chart: Category-wise variable expenses for selected month
        const categoryTotals = {};
        variableExpenses
          .filter((exp) => exp.month === selectedMonth)
          .forEach((exp) => {
            categoryTotals[exp.category] =
              (categoryTotals[exp.category] || 0) + exp.amount;
          });
        const expenseData = Object.entries(categoryTotals).map(
          ([category, amount]) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            amount,
          })
        );
        setExpenseData(expenseData);

        // Process data for Line Chart: Monthly savings trend (all months)
        const monthlyVariableTotals = {};
        variableExpenses.forEach((exp) => {
          monthlyVariableTotals[exp.month] =
            (monthlyVariableTotals[exp.month] || 0) + exp.amount;
        });

        const savingsTrend = months.map((month) => {
          const variableTotal = monthlyVariableTotals[month] || 0;
          const totalExpenses = fixedExpensesTotal + variableTotal;
          const savings = fixedIncome - totalExpenses;
          return {
            month,
            savings: savings > 0 ? savings : 0,
          };
        });
        setSavingsTrend(savingsTrend);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedMonth]); // Re-fetch when selectedMonth changes

  // Fetch Gemini response (unchanged)
  useEffect(() => {
    const fetchGeminiResponse = async () => {
      try {
        console.log(fixedIncome);
        const variableExpensesString = variableExpenses
          .filter((exp) => exp.month === selectedMonth)
          .map((exp) => `${exp.category}:${exp.amount}`)
          .join(",");
        const url = `http://localhost:3060/api/gemini?income=${fixedIncome}&fixedExpenses=${fixedExpensesTotal}&variableExpenses=${variableExpensesString}&targetSavings=500`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setGeminiResponse(data.response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeminiResponse();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Insights</h2>
      <p className="text-gray-700 mb-6">
        Visual overview of your monthly spending and savings.
      </p>

      {/* Month Selector */}
      <div className="mb-6">
        <label htmlFor="month-select" className="text-gray-700 mr-2">
          Select Month:
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Charts for insights */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading data...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : expenseData.length > 0 || savingsTrend.length > 0 ? (
        <InsightsChart expenseData={expenseData} savingsTrend={savingsTrend} />
      ) : (
        <p className="text-gray-500 text-center">
          No expense data available for {selectedMonth}.
        </p>
      )}

      {/* Gemini response */}
      <p id="gemini-response" className="mt-4 text-gray-800">
        {loading
          ? "Loading Gemini response..."
          : error
          ? `Error: ${error}`
          : geminiResponse}
      </p>
    </div>
  );
}

export default InsightsPage;
