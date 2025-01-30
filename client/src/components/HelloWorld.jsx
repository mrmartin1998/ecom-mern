import React from 'react';

const HelloWorld = () => {
  return (
    <div className="hero min-h-[50vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello World!</h1>
          <p className="py-6">Welcome to your MERN stack application.</p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloWorld;
