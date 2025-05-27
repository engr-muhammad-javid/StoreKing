import React, { useState, useRef } from 'react';
import { FaBell, FaChevronDown, FaChevronUp, FaGlobe } from 'react-icons/fa';
import AccountDropdown from './AccountDropdown';

const Header = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Bangla', 'Arabic'];

  // Close language dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (languageRef.current && !languageRef.current.contains(event.target)) {
      setIsLanguageOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800">ForeKing</h1>
        <div className="flex items-center space-x-4">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={languageRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <FaGlobe className="text-gray-600" />
              <span className="text-sm font-medium">{selectedLanguage}</span>
              {isLanguageOpen ? (
                <FaChevronUp className="text-gray-500 text-xs" />
              ) : (
                <FaChevronDown className="text-gray-500 text-xs" />
              )}
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                {languages.map((language) => (
                  <button
                    key={language}
                    onClick={() => {
                      setSelectedLanguage(language);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedLanguage === language
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>

          <AccountDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;