import React from 'react';

export const Input = ({ 
  label, 
  type = 'text', 
  error, 
  ...props 
}) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        type={type}
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
