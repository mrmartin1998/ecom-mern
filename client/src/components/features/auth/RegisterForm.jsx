import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import RegisterButton from './RegisterButton';
import PasswordStrength from './PasswordStrength';
import TermsCheckbox from './TermsCheckbox';
import FormError from './FormError';

const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser, isLoading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setError('');
    setTermsError('');

    if (!acceptedTerms) {
      setTermsError('You must accept the terms and conditions');
      return;
    }

    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Username field */}
      <div>
        <input
          type="text"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Username can only contain letters, numbers and underscores'
            }
          })}
          className="input input-bordered w-full"
          placeholder="Username"
        />
        {errors.username && <FormError message={errors.username.message} />}
      </div>

      {/* Email field */}
      <div>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="input input-bordered w-full"
          placeholder="Email"
        />
        {errors.email && <FormError message={errors.email.message} />}
      </div>

      {/* Password field */}
      <div>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[0-9])/,
              message: 'Password must contain at least one uppercase letter and one number'
            }
          })}
          className="input input-bordered w-full"
          placeholder="Password"
        />
        <PasswordStrength password={password} />
        {errors.password && <FormError message={errors.password.message} />}
      </div>

      <TermsCheckbox 
        checked={acceptedTerms} 
        onChange={setAcceptedTerms}
        error={termsError}
      />
      
      {error && <FormError message={error} />}

      <RegisterButton isLoading={isLoading} />
    </form>
  );
};

export default RegisterForm;
