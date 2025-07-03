import './Nav.css';
import logo from '../Static/logo.svg'; // Importing logo from Static folder

const Nav = () => {
  return (
    <nav className="navbar">
      <div className="meta">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="name">
          <h1>Photofolio</h1>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
