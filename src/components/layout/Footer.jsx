import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = ({ setPage }) => {
  return (
    <footer className="bg-amber-900 text-amber-100 p-8 mt-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold font-serif text-white mb-2">The Crusty Loaf</h3>
            <p>&copy; {new Date().getFullYear()} The Crusty Loaf. All Rights Reserved.</p>
          </div>
          <div className="flex justify-center space-x-4 my-4 md:my-0">
            <a href="/" className="text-amber-100 hover:text-white transition-colors">
              <Instagram size={24} />
            </a>
            <a href="/" className="text-amber-100 hover:text-white transition-colors">
              <Facebook size={24} />
            </a>
            <a href="/" className="text-amber-100 hover:text-white transition-colors">
              <Twitter size={24} />
            </a>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => setPage('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => setPage('about')} className="hover:text-white transition-colors">About</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;