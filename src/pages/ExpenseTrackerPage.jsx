import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';

function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  const getCategoryStyle = (category) => {
    const styles = {
      groceries: 'bg-gray-200 text-gray-800',
      utilities: 'bg-gray-100 text-gray-800',
      rent: 'bg-gray-300 text-gray-800',
      shopping: 'bg-gray-200 text-gray-800',
      travel: 'bg-gray-100 text-gray-800',
      entertainment: 'bg-gray-300 text-gray-800',
      healthcare: 'bg-gray-200 text-gray-800',
      dining: 'bg-gray-100 text-gray-800',
      other: 'bg-gray-300 text-gray-800',
    };
    return styles[category] || styles.other;
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('No user email found in localStorage. Please log in again.');
    }
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchExpenses = async () => {
      try {
        const response = await fetch(`http://localhost:3070/api/variable-expenses?email=${encodeURIComponent(email)}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch expenses');
        }
        const data = await response.json();
        setExpenses(data.expenses.map(exp => ({
          id: exp.expenseId ? exp.expenseId.toString() : new Date().getTime().toString(),
          amount: exp.amount,
          category: exp.category,
          description: exp.description,
          month: exp.month,
        })));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchExpenses();
  }, [email]);

  const addExpense = async (expense) => {
    if (!email) {
      setError('User email not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3070/api/variable-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...expense, email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }
      const data = await response.json();
      const expensesArray = data.data.expenses || [];
      const newExpense = expensesArray.length > 0 ? expensesArray[expensesArray.length - 1] : null;
      if (!newExpense || !newExpense.expenseId) {
        throw new Error('Invalid expense data returned from server');
      }
      setExpenses([...expenses, {
        id: newExpense.expenseId.toString(),
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        month: expense.month,
      }]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteExpense = async (id) => {
    if (!email) {
      setError('User email not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3070/api/variable-expenses/${id}?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Moved months array here, before recentExpenses
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const recentExpenses = [...expenses]
    .sort((a, b) => months.indexOf(b.month) - months.indexOf(a.month))
    .slice(0, 10);

  return (
    <div
      className="min-h-screen bg-gray-900 bg-opacity-90 pt-8 pb-12"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-4xl font-serif font-bold text-white mb-2 text-center">
          Expense Tracker
        </h1>
        {email && <p className="text-gray-300 text-center mb-4">Logged in as: {email}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <ExpenseForm onSubmit={addExpense} />
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-300">
              <h3 className="text-lg font-serif font-medium text-gray-800 mb-2 border-b border-gray-300 pb-2">
                Financial Summary
              </h3>
              <p className="text-gray-700 font-serif">
                Total Expenses:{' '}
                <span className="font-semibold">
                  {formatCurrency(expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0))}
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-gray-300">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-xl font-serif font-semibold text-gray-800">
                  Recent Expenses (Last 10)
                </h2>
              </div>

              {recentExpenses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentExpenses.map((expense) => (
                    <li key={expense.id} className="p-4 hover:bg-gray-100 transition duration-150">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800 font-serif">
                            {expense.description || 'Unnamed expense'}
                          </p>
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full border border-gray-400 ${getCategoryStyle(
                                expense.category
                              )}`}
                            >
                              {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                            </span>
                            <span className="text-gray-500 text-sm ml-2 font-serif">
                              {expense.month}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold font-serif">
                            {formatCurrency(expense.amount)}
                          </span>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
                            title="Delete expense"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500 font-serif italic">
                  No expenses yet. Add your first expense using the form.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTrackerPage;