import React from "react";

const LandingPage = () => {
  const backendBaseUrl = "http://localhost:3010";
  const frontendRedirectUrl = "http://localhost:3000/welcome";

  const handleAuthRedirect = (type) => {
    const base = type === "signup" ? "/signup" : "/login";
    window.location.href = `${backendBaseUrl}${base}?returnTo=${encodeURIComponent(frontendRedirectUrl)}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-blue-200 text-center px-6">
      <h1 className="text-4xl font-bold text-indigo-800 mb-4">
        Welcome to Smart Finance Helper
      </h1>
      <p className="text-gray-700 mb-8 max-w-md">
        Manage your budget, track expenses, and get smart AI insights.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => handleAuthRedirect("login")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200"
        >
          Login
        </button>
        <button
          onClick={() => handleAuthRedirect("signup")}
          className="bg-white border border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
