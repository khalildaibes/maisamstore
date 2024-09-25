import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart } from '.';
import { useStateContext } from '../context/StateContext';
import translations from '../translations/translations'; // Import translations

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities, categories, language, changeLanguage } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    // Toggle between English ('en'), Arabic ('ar'), and Hebrew ('he')
    if (language === 'en') {
      changeLanguage('ar');
    } else if (language === 'ar') {
      changeLanguage('he');
    } else {
      changeLanguage('en');
    }
    // Additional logic to handle language change (e.g., updating content, storing preference)
  };

  return (
    <div 
    className="navbar-container"
  
  >
      <Link href="/" passHref>
        <img
          src="/maisamnakeuplogo.png"
          className="logo-img"
          alt="Logo"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      {/* Navigation Links */}
      <nav className="navbar">
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {Object.keys(categories).slice(0, isMobile ? undefined : 6).map((category) => (
            <Link href={`/catgeory_products?categoryName=${category}`} key={category}>
              <a>{category.replace("_", " ")}</a>
            </Link>
          ))}
        </div>
      </nav>

      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>


      
      {/* Language Toggle Button */}
      <button
        type="button"
        className="language-toggle-btn"
        onClick={toggleLanguage}
      >
        {translations[language].switchTo}
      </button>

      {isMobile && (
        <button type="button" className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      )}

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
