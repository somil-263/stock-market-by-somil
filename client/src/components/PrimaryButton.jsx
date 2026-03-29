import React from 'react';

function PrimaryButton({ text, onClick }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      {text}
    </button>
  );
}

export default PrimaryButton;