import React from 'react';

const AboutPage = () => {
  return (
    <div className="prose lg:prose-xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">About</h1>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">MERN Stack Application</h2>
          <p>This is a template application built with:</p>
          <ul className="list-disc list-inside">
            <li>MongoDB</li>
            <li>Express.js</li>
            <li>React</li>
            <li>Node.js</li>
            <li>DaisyUI</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 