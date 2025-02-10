import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setEmailSent(true);
        toast.success('Password reset instructions sent to your email');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Check Your Email</h2>
        <p className="text-center mb-4">
          We've sent password reset instructions to {email}
        </p>
        <button 
          className="btn btn-primary w-full"
          onClick={() => navigate('/login')}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button 
          className={`btn btn-primary w-full mt-4 ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          Send Reset Instructions
        </button>
      </form>
      <div className="text-center mt-4">
        <button 
          className="btn btn-link"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword; 