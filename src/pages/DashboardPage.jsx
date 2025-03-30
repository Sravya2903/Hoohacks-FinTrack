import React, { useState, useEffect } from 'react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function DashboardPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [fixedIncome, setFixedIncome] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setError('No user email found. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3070/api/monthly-expenses?email=${encodeURIComponent(email)}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch monthly expenses');
        }
        const data = await response.json();
        setMonthlyExpenses(data.monthlyExpenses);
        setFixedIncome(data.fixedIncome);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMonthlyExpenses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
        Your 12-Month Finance Planner
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month) => {
          const spent = monthlyExpenses[month] || 0; // Default to 0 if no data
          const percentage = fixedIncome > 0 ? Math.min((spent / fixedIncome) * 100, 100).toFixed(0) : 0;
          const statusColor = spent > fixedIncome ? 'text-red-600' : 'text-green-600';

          return (
            <div
              key={month}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{month}</h3>

              {spent > 0 ? ( // Changed from spent check to spent > 0
                <>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Income:</span> ${fixedIncome.toFixed(2)}</p>
                    <p><span className="font-medium">Expenses:</span> ${spent.toFixed(2)}</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className={`mt-2 font-semibold ${statusColor}`}>
                    {spent > fixedIncome ? 'Over Budget' : 'Within Budget'}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 mt-4">No expenses recorded</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardPage;