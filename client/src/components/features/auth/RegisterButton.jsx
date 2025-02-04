import LoadingSpinner from '@/components/common/ui/LoadingSpinner';

const RegisterButton = ({ isLoading }) => {
  return (
    <button 
      type="submit"
      disabled={isLoading}
      className="btn btn-primary w-full"
    >
      {isLoading ? 'Creating Account...' : 'Create Account'}
    </button>
  );
};

export default RegisterButton;
