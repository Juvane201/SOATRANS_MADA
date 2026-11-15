// frontend/src/components/Button.jsx
function Button({ children, variant = 'primary', ...props }) {
    const baseStyles = 'px-4 py-2 rounded font-semibold focus:outline-none';
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };
  
    return (
      <button className={`${baseStyles} ${variants[variant]}`} {...props}>
        {children}
      </button>
    );
  }
  
  export default Button;