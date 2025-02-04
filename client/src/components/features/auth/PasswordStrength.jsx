const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { strength: 0, message: '' };
    
    let strength = 0;
    let message = 'Weak';

    // Length check (min 8 chars)
    if (password.length >= 8) strength += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Number check
    if (/[0-9]/.test(password)) strength += 1;

    // Update message based on strength
    if (strength === 3) message = 'Strong';
    else if (strength === 2) message = 'Medium';

    return { strength, message };
  };

  const { strength, message } = getStrength();

  return password ? (
    <div className="mt-1">
      <div className="flex gap-1 h-1 mb-1">
        <div className={`flex-1 rounded ${strength >= 1 ? 'bg-error' : 'bg-base-300'}`} />
        <div className={`flex-1 rounded ${strength >= 2 ? 'bg-warning' : 'bg-base-300'}`} />
        <div className={`flex-1 rounded ${strength >= 3 ? 'bg-success' : 'bg-base-300'}`} />
      </div>
      <span className="text-xs">{message}</span>
    </div>
  ) : null;
};

export default PasswordStrength;
