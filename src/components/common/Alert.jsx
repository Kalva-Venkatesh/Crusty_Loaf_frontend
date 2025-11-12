import React from 'react';

const Alert = ({ message, type = 'error' }) => {
  const colors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
  };
  return (
    <div className={`border ${colors[type]} px-4 py-3 rounded-lg relative`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Alert;