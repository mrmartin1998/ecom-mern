import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';

const EmailVerification = () => {
  const [status, setStatus] = useState('loading');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        console.log('Verification response:', response);
        
        if (response.data?.isAlreadyVerified) {
          setStatus('already-verified');
        } else if (response.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Verifying your email...</p>
        </div>
      );
    }

    const content = {
      success: {
        title: 'Email Verified Successfully!',
        message: 'You can now log in to your account.',
        buttonText: 'Go to Login',
        buttonAction: () => navigate('/login'),
        buttonClass: 'btn-primary',
        titleClass: 'text-success'
      },
      'already-verified': {
        title: 'Email Already Verified',
        message: 'Your email has already been verified. You can log in to your account.',
        buttonText: 'Go to Login',
        buttonAction: () => navigate('/login'),
        buttonClass: 'btn-primary',
        titleClass: 'text-info'
      },
      error: {
        title: 'Verification Failed',
        message: 'The verification link is invalid or has expired.',
        buttonText: 'Back to Register',
        buttonAction: () => navigate('/register'),
        buttonClass: 'btn-outline',
        titleClass: 'text-error'
      }
    };

    const currentContent = content[status];

    return (
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${currentContent.titleClass} mb-4`}>
          {currentContent.title}
        </h2>
        <p className="mb-4">{currentContent.message}</p>
        <button 
          className={`btn ${currentContent.buttonClass}`}
          onClick={currentContent.buttonAction}
        >
          {currentContent.buttonText}
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-lg">
      {renderContent()}
    </div>
  );
};

export default EmailVerification; 