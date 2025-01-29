import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart } from '.';
import { useStateContext } from '../context/StateContext';
import translations from '../translations/translations'; // Import translations
import { FaWheelchair } from 'react-icons/fa'; // Import wheelchair icon

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const { language, changeLanguage } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false); // State to manage toolbar visibility

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
  };

  // Toggle the visibility of the accessibility toolbar
  const toggleAccessibilityToolbar = () => {
    console.log(!isToolbarVisible)
    setIsToolbarVisible(!isToolbarVisible);
  };

  // Function to enable keyboard navigation
  const toggleKeyboardNavigation = () => {
    document.body.tabIndex = 0;
    alert('Keyboard navigation enabled');
  };

  // Function to toggle high contrast mode
  const toggleHighContrast = (mode) => {
    document.body.classList.remove('high-contrast-black', 'high-contrast-white');
    if (mode === 'black') {
      document.body.classList.add('high-contrast-black');
    } else if (mode === 'white') {
      document.body.classList.add('high-contrast-white');
    }
  };

  // Function to toggle grayscale mode
  const toggleGrayscale = () => {
    document.body.classList.toggle('grayscale');
  };

  // Function to adjust font size
  const adjustFontSize = (action) => {
    const currentSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));
    if (action === 'increase') {
      document.body.style.fontSize = (currentSize + 2) + 'px';
    } else if (action === 'decrease') {
      document.body.style.fontSize = (currentSize - 2) + 'px';
    }
  };

  // Function to underline links
  const toggleUnderlineLinks = () => {
    document.body.classList.toggle('underline-links');
  };

  // Function to toggle a readable font
  const toggleReadableFont = () => {
    document.body.classList.toggle('readable-font');
  };

  // Function to reset all accessibility options
  const resetAccessibility = () => {
    document.body.classList.remove('high-contrast-black', 'high-contrast-white', 'grayscale', 'underline-links', 'readable-font');
    document.body.style.fontSize = '';
  };

  // Function to show accessibility statement
  const showAccessibilityStatement = () => {
    alert('Accessibility statement: This website is designed to be accessible to all users.');
  };

  return (
    <div className="navbar-container">
      {/* Logo */}
      <Link href="/" passHref>
        <img
          src="/Red and Black Retro Barbershop Logo.png"
          className="logo-img"
          alt="Logo"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      {/* Navigation Links */}
      <nav className="navbar">
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/brands">{translations[language].brands}</Link>
          <Link href="/catgeory_products?categoryName=Face">{translations[language].face}</Link>
          <Link href="/catgeory_products?categoryName=Cheeks">{translations[language].cheeks}</Link>
          <Link href="/catgeory_products?categoryName=Eyes">{translations[language].eyes}</Link>
          <Link href="/catgeory_products?categoryName=Lips">{translations[language].lips}</Link>
          <Link href="/catgeory_products?categoryName=Hair">{translations[language].hair}</Link>
        </div>
      </nav>

      {/* Accessibility Button */}
      <button
        id="accessibilityButton"
        className="accessibility-float-btn"
        onClick={toggleAccessibilityToolbar}
      >
        <FaWheelchair />
      </button>

      {/* Accessibility Toolbar */}
      
        <div className={`accessibilityToolbar ${isToolbarVisible ? 'active' : ''}`}>

          <button onClick={toggleKeyboardNavigation}>ניווט בעזרת מקלדת</button>
          <button onClick={() => toggleHighContrast('black')}>התאמה לכבדי ראייה (שחור)</button>
          <button onClick={() => toggleHighContrast('white')}>התאמה לכבדי ראייה (לבן)</button>
          <button onClick={toggleGrayscale}>שחור לבן</button>
          <button onClick={() => adjustFontSize('increase')}>הגדל גודל פונט</button>
          <button onClick={() => adjustFontSize('decrease')}>הקטן גודל פונט</button>
          <button onClick={toggleUnderlineLinks}>קו תחתון לקישורים</button>
          <button onClick={toggleReadableFont}>פונט קריא</button>
          <button onClick={resetAccessibility}>ביטול נגישות</button>
          <button onClick={showAccessibilityStatement}>הצהרת נגישות</button>
        </div>
      

      {/* Cart Icon */}
      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {/* Language Toggle Button */}
      <button type="button" className="language-toggle-btn" onClick={toggleLanguage}>
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
