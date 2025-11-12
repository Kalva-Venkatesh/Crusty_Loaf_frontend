import React from 'react';
import { Home, User, LogIn, LogOut, Package, Settings, X, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileMenu = ({ isOpen, setOpen, setPage }) => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  
  const NavLink = ({ page, icon, children }) => (
    <button
      onClick={() => {
        setPage(page);
        setOpen(false);
      }}
      className="flex items-center space-x-3 p-3 w-full text-left text-lg text-gray-700 hover:bg-amber-50 rounded-lg"
    >
      {icon}
      <span>{children}</span>
    </button>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xl font-bold text-amber-900 font-serif">Menu</span>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink page="home" icon={<Home size={24} />}>Home</NavLink>
          <NavLink page="about" icon={<Info size={24} />}>About Us</NavLink> {/* <-- New Link */}
          {isAuthenticated && (
            <>
              <NavLink page="profile" icon={<User size={24} />}>Profile</NavLink>
              <NavLink page="orders" icon={<Package size={24} />}>My Orders</NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink page="admin" icon={<Settings size={24} />}>Admin Panel</NavLink>
          )}
          
          <hr className="my-4" />
          
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setPage('home');
                setOpen(false);
              }}
              className="flex items-center space-x-3 p-3 w-full text-left text-lg text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={24} />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink page="login" icon={<LogIn size={24} />}>Login</NavLink>
          )}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;