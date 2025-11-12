import React from 'react';

const Input = ({ id, label, type = 'text', className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      id={id}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent ${className}`}
      {...props}
    />
  </div>
);

export default Input;