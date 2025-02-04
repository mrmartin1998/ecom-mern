const TermsCheckbox = ({ checked, onChange, error }) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input 
          type="checkbox" 
          className="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="label-text">I accept the terms and conditions</span>
      </label>
      {error && <span className="text-error text-sm">{error}</span>}
    </div>
  );
};

export default TermsCheckbox;
