import "./logo.css";
import logo from "../../assets/images/logo.png";

export const Logo = () => {
  return (
    <div className="logo">
      <img src={logo} alt="Logo" className="logo-img" />
      <div
        className="text-7xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent"
      >
        Happenize
      </div>
    </div>
  );
};