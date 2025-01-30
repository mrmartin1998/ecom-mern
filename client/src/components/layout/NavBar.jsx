import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="navbar bg-base-100 shadow-lg backdrop-blur-lg bg-opacity-90">
        <div className="navbar-start">
          <div className="dropdown">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost lg:hidden"
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul 
              tabIndex={0} 
              className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isMenuOpen ? 'block' : 'hidden'}`}
            >
              <li onClick={closeMenu}><Link to="/">Home</Link></li>
              <li onClick={closeMenu}><Link to="/about">About</Link></li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">MERN App</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
