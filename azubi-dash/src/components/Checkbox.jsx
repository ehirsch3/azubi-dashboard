import React from 'react';

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          checked={checked} // Use 'checked' for controlled state
          onChange={onChange} // Pass the parent component's handler
          className="checkbox checkbox-primary"
        />
        {label && <span className="ml-2 text-sm text-gray-600">{label}</span>} {/* Optional label */}
      </label>
    </div>
  );
};

export default Checkbox;
