import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex space-x-6">
        <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
        <li><NavLink to="/tracker" className="hover:underline">Tracker</NavLink></li>
        <li><NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink></li>
        <li><NavLink to="/insights" className="hover:underline">Insights</NavLink></li>
        <li><NavLink to="/settings" className="hover:underline">Settings</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;