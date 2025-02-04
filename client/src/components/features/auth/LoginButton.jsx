import LoadingSpinner from '@/components/common/ui/LoadingSpinner';

const LoginButton = ({ isLoading }) => {
  return (
    <button 
      type="submit"
      disabled={isLoading}
      className="btn btn-primary w-full"
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        'Login'
      )}
    </button>
  );
};

export default LoginButton;
