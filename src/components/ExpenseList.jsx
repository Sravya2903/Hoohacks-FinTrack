import React from 'react';

function ExpenseList() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Recent Expenses</h3>
      <ul className="space-y-2">
        <li className="p-2 bg-white shadow rounded">Food - $20</li>
        <li className="p-2 bg-white shadow rounded">Transport - $15</li>
      </ul>
    </div>
  );
}

export default ExpenseList;