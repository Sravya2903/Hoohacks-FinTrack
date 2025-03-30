import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SetupWizardPage() {
  const [income, setIncome] = useState('');
  const [budgetGoal, setBudgetGoal] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  const navigate = useNavigate();

  const fixedExpenseCategories = [
    'Rent', 'Utilities', 'Groceries', 'Insurance', 'Transport', 'Subscriptions', 'Loan Payment', 'Others'
  ];

  // Fetch email from localStorage or API on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Fallback: Fetch from /api/session if not in localStorage
      const fetchEmail = async () => {
        try {
          const response = await fetch('http://localhost:3010/api/session', {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
              setEmail(data.email);
              localStorage.setItem('userEmail', data.email);
            }
          }
        } catch (err) {
          console.error('Error fetching email:', err);
        }
      };
      fetchEmail();
    }
  }, []);

  const handleAddExpense = () => {
    if (selectedCategory && expenseAmount) {
      setExpenses([...expenses, { category: selectedCategory, amount: parseFloat(expenseAmount) }]);
      setSelectedCategory('');
      setExpenseAmount('');
    }
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleContinue = async () => {
    if (!email) {
      setError('User email not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3070/api/fixed-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include Auth0 session cookie
        body: JSON.stringify({
          email, // Include email in payload (optional, backend uses req.oidc.user.email)
          income: parseFloat(income),
          budgetGoal: parseFloat(budgetGoal),
          expenses,
        }),
      });

      if (!response.ok) throw new Error('Failed to save fixed expenses');
      navigate('/tracker');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Setup Your Budget</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {email && <p className="text-center text-gray-600">Logged in as: {email}</p>}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your monthly income"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Budget Goal (Savings)</label>
            <input
              type="number"
              value={budgetGoal}
              onChange={(e) => setBudgetGoal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
              placeholder="Target savings per month"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fixed Expense Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="">Select category</option>
                {fixedExpenseCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                placeholder="$"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddExpense}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Add Expense
          </button>
        </form>

        {expenses.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
            <h4 className="text-lg font-semibold mb-2">Your Fixed Expenses</h4>
            <ul className="space-y-1">
              {expenses.map((exp, index) => (
                <li key={index} className="flex justify-between">
                  <span>{exp.category}</span>
                  <span>${exp.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-medium text-gray-700">
              Total Expenses: <span className="text-indigo-700">${totalExpenses.toFixed(2)}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!income || !budgetGoal || !email}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

export default SetupWizardPage;