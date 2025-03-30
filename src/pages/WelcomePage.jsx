import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function WelcomePage() {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFixedExpenses, setHasFixedExpenses] = useState(false);

  useEffect(() => {
    const fetchSessionAndExpenses = async () => {
      try {
        // Step 1: Fetch session to get email
        const sessionResponse = await fetch('http://localhost:3010/api/session', {
          credentials: 'include', // Include Auth0 session cookie
        });
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData.authenticated) {
            setEmail(sessionData.email);
            localStorage.setItem('userEmail', sessionData.email);

            // Step 2: Check if fixed expenses exist for this user
            const fixedExpensesResponse = await fetch(
              `http://localhost:3070/api/fixed-expenses?email=${encodeURIComponent(sessionData.email)}`,
              { credentials: 'include' }
            );
            if (fixedExpensesResponse.ok) {
              const fixedExpensesData = await fixedExpensesResponse.json();
              if (fixedExpensesData.data) {
                setHasFixedExpenses(true); // Fixed expenses exist
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching session or fixed expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndExpenses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Smart Finance Helper
      </h1>
      {loading ? (
        <p className="text-lg mb-6">Loading...</p>
      ) : email ? (
        <p className="text-lg mb-6">
          Hello, {email}! Track your expenses and manage your budget with ease.
        </p>
      ) : (
        <p className="text-lg mb-6">
          Track your expenses and manage your budget with ease.
        </p>
      )}
      {!loading && (
        <Link
          to={hasFixedExpenses ? "/tracker" : "/setup"}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Get Started
        </Link>
      )}
    </div>
  );
}

export default WelcomePage;