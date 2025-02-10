import ResetPassword from '@/components/features/auth/ResetPassword';

const ResetPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Set New Password</h1>
        <ResetPassword />
      </div>
    </div>
  );
};

export default ResetPasswordPage; 