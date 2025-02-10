import ForgotPassword from '@/components/features/auth/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Reset Password</h1>
        <ForgotPassword />
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 