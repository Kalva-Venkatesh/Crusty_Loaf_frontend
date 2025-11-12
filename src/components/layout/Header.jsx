import React from 'react';
import { Home, ShoppingCart, User, LogIn, LogOut, Package, Settings, Menu, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = ({ setPage, setMobileMenuOpen }) => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const NavLink = ({ page, icon, children }) => (
    <button
      onClick={() => setPage(page)}
      className="flex items-center space-x-1 text-gray-600 hover:text-amber-800 transition-colors"
    >
      {icon}
      <span className="hidden md:inline">{children}</span>
    </button>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-gray-600 hover:text-amber-800"
          >
            <Menu size={24} />
          </button>
          <button
            onClick={() => setPage('home')}
            className="text-2xl font-bold text-amber-900 font-serif"
          >
            The Crusty Loaf
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <NavLink page="home" icon={<Home size={20} />}>Home</NavLink>
          <NavLink page="about" icon={<Info size={20} />}>About Us</NavLink> {/* <-- New Link */}
          {isAdmin && (
            <NavLink page="admin" icon={<Settings size={20} />}>Admin</NavLink>
          )}
          {isAuthenticated && (
            <NavLink page="orders" icon={<Package size={20} />}>My Orders</NavLink>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPage('cart')}
            className="relative text-gray-600 hover:text-amber-800 transition-colors"
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button
                onClick={() => setPage('profile')}
                className="flex items-center space-x-1 text-gray-600 hover:text-amber-800 focus:outline-none"
              >
                <User size={24} />
                <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
              </button>
              
              {/* --- BUG FIX APPLIED --- */}
              {/* Changed `mt-1` to `top-full pt-1` to remove the gap. */}
              {/* Added `focus-within:block` for accessibility. */}
              <div 
                className="absolute right-0 top-full pt-1 w-40 rounded-lg shadow-lg overflow-hidden hidden group-hover:block focus-within:block z-50"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <button
                        onClick={() => setPage('profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => {
                        logout();
                        setPage('home');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <NavLink page="login" icon={<LogIn size={20} />}>Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;