import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // For making the pop-up notification
import translations from '../translations/translations';

const Context = createContext(); // Create context

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false); // State for cart visibility
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const [totalQuantities, setTotalQuantities] = useState(0); // State for total quantities
  const [qty, setQty] = useState(1); // State for individual product quantity
  const [language, setLanguage] = useState('en'); // State for managing the selected language

  useEffect(() => {
    // Set text direction based on the selected language
    const direction = language === 'ar' || language === 'he' ? 'rtl' : 'ltr';
    document.getElementsByTagName('html')[0].setAttribute('dir', direction);
  }, [language]); // Run whenever language changes

  let foundProduct;
  let index;

  // Function to AddToCart
  const onAdd = (product, quantity, selectedColor = null) => {
   
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    if (checkProductInCart) {
      var enough = true;
      cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id){
          if (cartProduct.old_quantity < cartProduct.quantity + quantity){
            enough = false;
            }
        }
    }

      );

      if (!enough){
        alert(translations[language].soldOut.replace('${item.name}',cartProduct.name));
        return ;
      }
    }
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
  
    if (checkProductInCart) {
      // Update quantity of existing product
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
            color: selectedColor || cartProduct.color, // Retain existing color if no new color is selected
          };
        return cartProduct;
      });
  
      setCartItems(updatedCartItems);
    } else {
      // Add new product to cart
      product.old_quantity = product.quantity;
      product.quantity = quantity;
      product.color = selectedColor; // Store the selected color
      setCartItems([...cartItems, { ...product }]);
    }
  
    // Show notification
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  // Function to remove an item from the cart
  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  // Function to change item quantity in cart
  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === 'inc') {
      var enough = true;

        if (foundProduct.old_quantity < foundProduct.quantity + 1){
          enough = false;
          }
      if (!enough){
        alert(translations[language].soldOut.replace('${item.name}',foundProduct.name));
        return ;
      }
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === 'dec') {
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  // Function to increment quantity
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  // Function to decrement quantity
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    toast.success('Cart has been cleared.');
  };

  // Function to change language and set text direction
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    // Returning Context Provider
    <Context.Provider
      value={{
        // Passing values across entire application
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        totalQuantities,
        showCart,
        cartItems,
        toggleCartItemQuanitity,
        totalPrice,
        onRemove,
        setCartItems,
        setTotalQuantities,
        setTotalPrice,
        clearCart, // Added clearCart function
        language, // Added language to context
        changeLanguage, // Added function to change language
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
