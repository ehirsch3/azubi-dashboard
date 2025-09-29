import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-xl text-gray-700 mb-8">
        You do not have permission to access this page.
      </p>
      <Link
        to="/home"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
