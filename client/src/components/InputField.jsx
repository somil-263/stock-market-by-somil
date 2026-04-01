import React from 'react';

function InputField({ label, name, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
        {label}
      </label>
      <input 
        type={type} 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
      />
    </div>
  );
}

export default InputField;