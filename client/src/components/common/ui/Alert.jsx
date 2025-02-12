import React from 'react';

export const Alert = ({ type = 'info', message, onClose }) => {
  const alertTypes = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  };

  return (
    <div className={`alert ${alertTypes[type]} shadow-lg`}>
      <div>
        <span>{message}</span>
      </div>
      {onClose && (
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};
