import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, Menu, X } from 'lucide-react';
import { selectIsDarkMode } from '../redux/features/cryptoSlice';

const Header: React.FC = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="h-7 w-7 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold">CryptoTracker</h1>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className={`transition ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Cryptocurrencies</a>
              </li>
              <li>
                <a href="#" className={`transition ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Exchanges</a>
              </li>
              <li>
                <a href="#" className={`transition ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>NFTs</a>
              </li>
              <li>
                <a href="#" className={`transition ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Portfolio</a>
              </li>
            </ul>
          </nav>
          <div className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <nav className="flex flex-col space-y-4">
            <a href="#" className={`transition block py-2 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>Cryptocurrencies</a>
            <a href="#" className={`transition block py-2 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>Exchanges</a>
            <a href="#" className={`transition block py-2 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>NFTs</a>
            <a href="#" className={`transition block py-2 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>Portfolio</a>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition w-full">
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;