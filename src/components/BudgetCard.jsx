import React from 'react';

function BudgetCard({ title, amount, spent }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-700">Spent: ${spent} / ${amount}</p>
    </div>
  );
}

export default BudgetCard;