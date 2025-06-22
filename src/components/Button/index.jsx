import "./button.css";

export const Button = ({ children, onClick, type = "button", ...props }) => (
  <button
    type={type}
    onClick={onClick}
    className="button bg-gradient-to-b from-orange-400 to-orange-600 text-white font-semibold py-2 px-4 rounded shadow"
    {...props}
  >
    {children}
  </button>
);