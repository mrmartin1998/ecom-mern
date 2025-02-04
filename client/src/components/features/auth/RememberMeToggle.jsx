const RememberMeToggle = ({ checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="checkbox checkbox-sm"
      />
      <span className="text-sm">Remember me</span>
    </label>
  );
};

export default RememberMeToggle;
