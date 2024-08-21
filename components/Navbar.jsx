import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart } from '.';
import { useStateContext } from '../context/StateContext';
import logo from '../maisamnakeuplogo.png'; // Adjust the path according to your project structure

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = React.useState(false);

  const toggleNavMenu = () => {
    setIsNavMenuOpen(!isMenuOpen);
  };
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

  return (
    <div className="navbar-container">
      <img src={logo} className='logo-img'/> 

      
    <nav className="navbar">

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link href="/categories/palettes">Palettes</Link>
        <Link href="/categories/mascara">Mascara</Link>
        <Link href="/categories/eyeshadow">Eyeshadow</Link>
        <Link href="/categories/blush">Blush</Link>
        <Link href="/categories/lipstick">Lipstick</Link>
        <Link href="/categories/concealer">Concealer</Link>
      </div>
    </nav>
  

      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {/* Hamburger Menu Icon */}
      {isMobile&& (
        <button type="button" className={`menu-icon ${isMobile ? 'active' : ''}`} onClick={toggleMenu}>
        {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>
      )}


      {/* Only show the Cart when setShowCart is true */}
      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
