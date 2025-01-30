import React from 'react';

const FirstComponent = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">This is my first React component!</h2>
        <p>I'm learning how to build with React!</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Cool!</button>
        </div>
      </div>
    </div>
  );
};

export default FirstComponent; 