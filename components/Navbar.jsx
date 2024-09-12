import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart } from '.';
import { useStateContext } from '../context/StateContext';
import translations from '../translations/translations'; // Import translations

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const { language, changeLanguage } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize(); // Set initial value
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
    <div className="navbar-container">
      {/* Logo */}
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
          <Link href="/brands">
            {translations[language].brands}
          </Link>
          <Link href="/catgeory_products?categoryName=Face">
            {translations[language].face}
          </Link>
          <Link href="/catgeory_products?categoryName=Cheeks">
            {translations[language].cheeks}
          </Link>
          <Link href="/catgeory_products?categoryName=Eyes">
            {translations[language].eyes}
          </Link>
          <Link href="/catgeory_products?categoryName=Lips">
            {translations[language].lips}
          </Link>
          <Link href="/catgeory_products?categoryName=Hair">
            {translations[language].hair}
          </Link>

        </div>
      </nav>

      {/* Cart Icon */}
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

      {/* Hamburger Menu Icon for Mobile */}
      {isMobile && (
        <button type="button" className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      )}

      {/* Cart Component */}
      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
