import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/features/auth/LoginForm';
import { ROUTES } from '@/config/routes';

const LoginPage = () => {
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <LoginForm onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
