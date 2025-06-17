import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart } from '.';
import { useStateContext } from '../context/StateContext';
import translations from '../translations/translations'; // Import translations
import { FaWheelchair } from 'react-icons/fa'; // Import wheelchair icon
import styles from './Navbar.module.css';

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const { language, changeLanguage } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false); // State to manage toolbar visibility

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 900);
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
    <header className={styles.header}>
      <div className={styles.navbarWrapper}>
        {/* Logo */}
        <Link href="/" passHref className={styles.logoLink}>
          <img
            src="/wafaa-beauty-logo.jpg"
            className={styles.logoImg}
            alt="Logo"
            style={{ cursor: 'pointer' }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className={styles.navLinks + ' ' + (isMobile && isMenuOpen ? styles.active : '')}>
          <Link href="/brands" className={styles.navLink}>{translations[language].brands}</Link>
          <Link href="/catgeory_products?categoryName=hairCare" className={styles.navLink}>{translations[language].hairCare}</Link>
          <Link href="/catgeory_products?categoryName=hairStyling" className={styles.navLink}>{translations[language].hairStyling}</Link>
          <Link href="/catgeory_products?categoryName=skinCare" className={styles.navLink}>{translations[language].skinCare}</Link>
          <Link href="/catgeory_products?categoryName=hairTools" className={styles.navLink}>{translations[language].hairTools}</Link>
          <Link href="/catgeory_products?categoryName=grooming" className={styles.navLink}>{translations[language].grooming}</Link>
          <Link href="/catgeory_products?categoryName=electricShavers" className={styles.navLink}>{translations[language].electricShavers}</Link>
        </nav>

        {/* Right Side Icons */}
        <div className={styles.iconGroup}>
          {/* Accessibility Button */}
          <button className={styles.iconBtn} onClick={toggleAccessibilityToolbar} title="Accessibility">
            <FaWheelchair />
          </button>
          {/* Accessibility Toolbar */}
          <div className={styles.accessibilityToolbar + ' ' + (isToolbarVisible ? styles.active : '')}>
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
          <button className={styles.iconBtn} onClick={() => setShowCart(true)} title="Cart">
            <AiOutlineShopping />
            <span className={styles.cartQty}>{totalQuantities}</span>
          </button>
          {/* Language Toggle Button */}
          <button className={styles.iconBtn} onClick={toggleLanguage} title="Switch Language">
            {translations[language].switchTo}
          </button>
          {/* Hamburger Menu Icon for Mobile */}
          {isMobile && (
            <button className={styles.menuIcon} onClick={toggleMenu} title="Menu">
              {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          )}
        </div>
      </div>
      {/* Cart Component */}
      {showCart && <Cart />}
    </header>
  );
};

export default Navbar;
