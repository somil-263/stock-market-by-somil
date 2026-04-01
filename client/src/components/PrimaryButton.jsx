function PrimaryButton({ text, onClick, type = "button", disabled = false }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
    >
      {text}
    </button>
  );
}

export default PrimaryButton;