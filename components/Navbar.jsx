import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Cart } from '.';
import { useStateContext } from '../context/StateContext';

// Import Image from next/image if you want Next.js optimization (Optional)
import Image from 'next/image';

// If using a direct import, adjust the path accordingly
// import logo from 'assets/Maisamnakeuplogo.png'; // This would be if the logo is in src/assets

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
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

  return (
    <div className="navbar-container">
      {/* If the image is in the public folder, use the following */}
      <Link href="/" passHref>
        {/* The img tag should have a cursor style to indicate it is clickable */}
        <img
          src="/maisamnakeuplogo.png"
          className="logo-img"
          alt="Logo"
          style={{ cursor: 'pointer' }}
        />
      </Link>
      {/* If you prefer to use Next.js Image optimization, use the following */}
      {/* <Image src="/maisamnakeuplogo.png" alt="Logo" width={150} height={50} className="logo-img" /> */}

      <nav className="navbar">
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/catgeory_products?categoryName=palettes">Palettes</Link>
          <Link href="/catgeory_products?categoryName=mascara">Mascara</Link>
          <Link href="/catgeory_products?categoryName=eyeshadow">Eyeshadow</Link>
          <Link href="/catgeory_products?categoryName=blush">Blush</Link>
          <Link href="/catgeory_products?categoryName=lipstick">Lipstick</Link>
          <Link href="/catgeory_products?categoryName=concealer">Concealer</Link>
        </div>
      </nav>

      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {/* Hamburger Menu Icon */}
      {isMobile && (
        <button type="button" className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      )}

      {/* Only show the Cart when setShowCart is true */}
      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
