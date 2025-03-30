import React, { useState } from "react";

const ExpenseForm = ({ onSubmit }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("March"); // Default to March

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !amount || !category || !month) return;

    onSubmit({
      description,
      amount: parseFloat(amount),
      category,
      month, // Only month is submitted
    });

    // Clear fields
    setDescription("");
    setAmount("");
    setCategory("");
    setMonth("March"); // Reset to default
  };

  const categories = [
    "Groceries",
    "Utilities",
    "Rent",
    "Shopping",
    "Travel",
    "Entertainment",
    "Healthcare",
    "Dining",
    "Other",
  ];

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm p-6 rounded-xl shadow-md space-y-4 border border-gray-300 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Add New Expense</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Coffee, Internet Bill"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Amount ($)</label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 50"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        >
          <option value="" disabled>Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Month</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        >
          <option value="" disabled>Select month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;