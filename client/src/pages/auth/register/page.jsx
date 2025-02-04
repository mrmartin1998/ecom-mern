import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '@/components/features/auth/RegisterForm';
import { ROUTES } from '@/config/routes';

const RegisterPage = () => {
  const navigate = useNavigate();

  const onSuccess = () => {
    // Redirect to login page after successful registration
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <RegisterForm onSuccess={onSuccess} />
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="link link-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
