import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-base-100 shadow-xl rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
