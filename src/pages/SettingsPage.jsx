import React, { useState, useEffect } from 'react';

function SettingsPage() {
  const [income, setIncome] = useState('');
  const [budgetGoal, setBudgetGoal] = useState('');
  const [expenses, setExpenses] = useState([{ category: '', amount: '' }]); // Array for dynamic expenses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch current fixed expenses on mount
  useEffect(() => {
    const fetchFixedExpenses = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setError('No user email found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3070/api/fixed-expenses?email=${encodeURIComponent(email)}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch fixed expenses');
        }
        const data = await response.json();
        if (data.data) {
          setIncome(data.data.income.toString());
          setBudgetGoal(data.data.budgetGoal.toString());
          setExpenses(data.data.expenses.length > 0 ? data.data.expenses : [{ category: '', amount: '' }]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFixedExpenses();
  }, []);

  // Handle changes to individual expense fields
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
  };

  // Add a new expense field
  const addExpense = () => {
    setExpenses([...expenses, { category: '', amount: '' }]);
  };

  // Remove an expense field
  const removeExpense = (index) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  // Save updated fixed expenses
  const handleSave = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setError('No user email found. Please log in again.');
      return;
    }

    // Validate inputs
    if (!income || !budgetGoal || expenses.some(exp => !exp.category || !exp.amount)) {
      setError('Please fill in all fields.');
      return;
    }

    const fixedExpensesData = {
      email,
      income: parseFloat(income),
      budgetGoal: parseFloat(budgetGoal),
      expenses: expenses.map(exp => ({
        category: exp.category,
        amount: parseFloat(exp.amount),
      })),
    };

    try {
      const response = await fetch('http://localhost:3070/api/fixed-expenses', {
        method: 'POST', // Use POST to upsert (update or insert)
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(fixedExpensesData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save fixed expenses');
      }

      setSuccess('Fixed expenses saved successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Settings - Fixed Expenses</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {/* Income */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Monthly Income ($)</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3000"
              min="0"
            />
          </div>

          {/* Budget Goal */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Monthly Budget Goal ($)</label>
            <input
              type="number"
              value={budgetGoal}
              onChange={(e) => setBudgetGoal(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 500"
              min="0"
            />
          </div>

          {/* Fixed Expenses */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Fixed Expenses</label>
            {expenses.map((expense, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={expense.category}
                  onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
                  className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category (e.g., Rent)"
                />
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                  className="w-1/3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount"
                  min="0"
                />
                {expenses.length > 1 && (
                  <button
                    onClick={() => removeExpense(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addExpense}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Expense
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;