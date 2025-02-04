const RememberMeToggle = ({ checked, onChange }) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">Remember me</span>
        <input 
          type="checkbox" 
          className="toggle" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
    </div>
  );
};

export default RememberMeToggle;
