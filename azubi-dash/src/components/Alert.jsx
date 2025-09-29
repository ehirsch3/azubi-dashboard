import React, { useEffect } from 'react';

const Alert = ({ message, type = "info", onClose }) => {
  const alertTypes = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error"
  };

  return (
    <div
      role="alert"
      className={`alert ${alertTypes[type]} p-3 shadow-lg rounded-md w-auto max-w-xs`}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 9999
      }}
    >
      <div className="flex items-center text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 stroke-current mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Alert;
