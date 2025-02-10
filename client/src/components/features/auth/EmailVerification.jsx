import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = searchParams.get('token');
      console.log('Attempting verification with token:', token);
      const result = await verifyEmail(token);
      console.log('Verification result:', result);
      
      if (result.success) {
        setIsVerified(true);
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000); // Redirect after 3 seconds
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Email Verification</h1>
      
      {isVerified ? (
        <div className="text-center space-y-4">
          <p className="text-green-600">Email verified successfully!</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p>Please click the button below to verify your email address.</p>
          <button
            onClick={handleVerification}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default EmailVerification; 