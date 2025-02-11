import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import LoginButton from './LoginButton';
import RememberMeToggle from './RememberMeToggle';
import FormError from './FormError';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const onSubmit = async (data) => {
    try {
      console.log('Form data:', data);
      const success = await login(data);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="input input-bordered w-full"
          placeholder="Email"
          autoComplete="email"
        />
        {errors.email && <FormError message={errors.email.message} />}
      </div>

      <div>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="input input-bordered w-full"
          placeholder="Password"
          autoComplete="current-password"
        />
        {errors.password && <FormError message={errors.password.message} />}
      </div>

      <div className="flex justify-between items-center">
        <RememberMeToggle checked={remember} onChange={setRemember} />
        <Link 
          to="/auth/forgot-password" 
          className="text-primary text-sm hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
      
      {error && <FormError message={error} />}

      <LoginButton isLoading={isLoading} />
    </form>
  );
};

export default LoginForm;
