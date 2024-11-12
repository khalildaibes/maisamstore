import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { toast } from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { fetchStrapiData, getImageUrl } from '../lib/strapiClient';
import getStripe from "../lib/getStripe";
import translations from '../translations/translations'; // Import translations

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
    language, // Get language from context
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return; // Something went wrong

    const data = await response.json();

    toast.loading(translations[language].redirecting); // Use translation text

    stripe.redirectToCheckout({ sessionId: data.id }); // Redirect to stripe checkout
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">{translations[language].yourCart}</span>
          <span className="cart-num-items">({totalQuantities} {translations[language].totalItems})</span>
        </button>

        {/* Checking if cart is empty */}
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>{translations[language].emptyCartMessage}</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                {translations[language].continueShopping}
              </button>
            </Link>
          </div>
        )}

        {/* If cart is not empty */}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={getImageUrl(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                  </div>
                  <div className="flex top">
                    <h4>₪ {item.price}</h4>
                  </div>
                  <div className="flex top">
                    {item.color && (
                      <p>
                          {translations[language].selectedColor}
                          <div
                            className="color-circle"
                            style={{ backgroundColor: item.color.name }}
                            title={item.color.name}
                          />
                      </p>
                    )}
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num" onClick="">
                          {item.quantity}
                        </span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Subtotal calculation */}
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>{translations[language].subtotal}</h3>
              <h3>₪ {totalPrice}</h3>
            </div>
            <div className="btn-container">
              <Link href="/submitOrder">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCart(false)}
                >
                  {translations[language].submitOrder}
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
