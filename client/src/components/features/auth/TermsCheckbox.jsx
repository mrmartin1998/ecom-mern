const TermsCheckbox = ({ checked, onChange, error }) => {
  return (
    <div className="form-control">
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox checkbox-sm mt-1"
        />
        <span className="text-sm">
          I agree to the{' '}
          <a href="/terms" className="link link-primary" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="link link-primary" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </span>
      </label>
      {error && <span className="text-error text-sm mt-1">{error}</span>}
    </div>
  );
};

export default TermsCheckbox;
