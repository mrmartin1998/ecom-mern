import React from 'react';

const ThemeSwitcher = () => {
  const themes = ["dark", "light", "cupcake"];
  const [isOpen, setIsOpen] = React.useState(false);

  const changeTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const closeDropdown = (e) => {
      if (isOpen && !e.target.closest('.theme-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isOpen]);

  return (
    <div 
      className={`dropdown dropdown-end theme-dropdown ${isOpen ? 'dropdown-open' : ''}`}
    >
      <label 
        tabIndex={0} 
        className="btn m-1"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        Theme
        <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </label>
      <ul 
        tabIndex={0} 
        className={`dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 ${isOpen ? 'block' : 'hidden'}`}
      >
        {themes.map((theme) => (
          <li key={theme}>
            <button
              className="btn btn-sm btn-ghost w-full justify-start capitalize"
              onClick={() => changeTheme(theme)}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;