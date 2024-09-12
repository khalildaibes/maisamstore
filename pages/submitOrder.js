import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import translations from '../translations/translations'; // Import translations

const SubmitOrder = () => {
  const { cartItems, totalPrice, totalQuantities, language, clearCart } = useStateContext(); // Get language from context

  const [orderDetails, setOrderDetails] = useState({
    phoneNumber: "",
    name: "",
    addressType: "",
    address: "",
    street: "",
    city: "",
    paymentMethod: "",
    notes: "",
  });

  const [deliveryFee, setDeliveryFee] = useState(0); // State to track delivery fee
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Function to calculate the delivery fee based on addressType
  const calculateDeliveryFee = (addressType) => {
    if (addressType === "ARAB_48") {
      return 35;
    } else if (addressType === "West_Bank") {
      return 55;
    }
    return 0;
  };

  // useEffect to recalculate delivery fee when addressType changes
  useEffect(() => {
    const fee = calculateDeliveryFee(orderDetails.addressType);
    setDeliveryFee(fee);
  }, [orderDetails.addressType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    orderDetails.address = `${orderDetails.city}, ${orderDetails.street}`;

    // Validate form fields
    if (!orderDetails.name || !orderDetails.phoneNumber || !orderDetails.address) {
      alert('Please fill out all required fields.');
      return;
    }
    handleSubmitWhatsapp(event);
    clearCart();
  };

  const handleSubmitWhatsapp = async (event) => {
    event.preventDefault();

    // Prepare data for WhatsApp API call
    const data = {
      "messaging_product": "whatsapp",
      // WhatsApp API request structure here
      "to": "+972505831183",
      "type": "template",
      "template": {
        "name": "new_order",
        "language": {
          "code": "en",
          "policy": "deterministic"
        },
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": orderDetails.name
              },
              {
                "type": "text",
                "text": `+972${orderDetails.phoneNumber.substring(1)}`
              },
              {
                "type": "text",
                "text": orderDetails.address
              },
              {
                "type": "text",
                "text": orderDetails.notes
              },
              {
                "type": "text",
                "text": orderDetails.paymentMethod
              },
              {
                "type": "text",
                "text": cartItems.map(item => `product: ${item.name} \\n quantity: ${item.quantity} `).join(" \\n\\n")
              }
            ]
          }
        ]
      }
    };

    try {
      // Call the API route to send WhatsApp message
      const response = await fetch('https://graph.facebook.com/v18.0/209317558942807/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': 'Bearer EAANVrunrZADwBO7r4C0KoWsjkWp0nLIXqFIZCDYbHwFLtieaBgxUQWV3sJC0CZBupVZCG2t5gOFys2SoJfKc6fBrmAPpZCM6sGuBdXeRORYJk9a3VKYVZCRNaHMkKi3fNK7LFjSYW4mdg7Tvn9DVsWMnzv1NFZA1rZCZBysTZCJnQayUuFI9EFh7EQRXYfLpburii4BZCifRw2ibceclhfZA',
          'Cookie': 'ps_l=0; ps_n=0'
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Order submitted successfully and WhatsApp message sent!');
        setOrderSubmitted(true);
      } else {
        alert('Failed to send WhatsApp message. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while sending the order. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const totalWithDelivery = totalPrice + deliveryFee;

  return (
    <div className="submit-order-page">
      {!orderSubmitted ? (
        <div>
          <h2>{translations[language].submitYourOrder}</h2>
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
              <label htmlFor="name">{translations[language].name}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={orderDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">{translations[language].phoneNumber}</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={orderDetails.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="addressType">{translations[language].addressType}</label>
              <select
                id="addressType"
                name="addressType"
                value={orderDetails.addressType}
                onChange={handleInputChange}
                required
              >
                <option value="">{translations[language].selectaddressType}</option>
                <option value="ARAB_48">{translations[language].addressType_48}</option>
                <option value="West_Bank">{translations[language].addressType_westBank}</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="city">{translations[language].city}</label>
              <input
                type="text"
                id="city"
                name="city"
                value={orderDetails.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="street">{translations[language].street}</label>
              <input
                type="text"
                id="street"
                name="street"
                value={orderDetails.street}
                onChange={handleInputChange}
                required
              />
            </div>
           
            <div className="form-group">
              <label htmlFor="paymentMethod">{translations[language].paymentMethod}</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={orderDetails.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="">{translations[language].selectPaymentMethod}</option>
                <option value="Credit Card" disabled className="disabled">
                  {translations[language].creditCard}
                </option>
                <option value="Cash on Delivery">{translations[language].cashOnDelivery}</option>
                <option value="Bank Transfer">{translations[language].bankTransfer}</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="notes">{translations[language].notes}</label>
              <textarea
                id="notes"
                name="notes"
                value={orderDetails.notes}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-button">
              <button type="submit" className="btn submit-btn">
                {translations[language].submitOrder}
              </button>
            </div>
          </form>

          <div className="order-summary">
            <h3>{translations[language].yourCart}</h3>
            <div className="product-container">
              {cartItems.map((item) => (
                <div className="product" key={item._id}>
                  <img
                    src={urlFor(item?.image[0])}
                    alt=""
                    className="cart-product-image"
                  />
                  <div className="item-desc">
                    <div className="flex top">
                      <h5>{item.name}</h5>
                      <h4>₪ {item.price}</h4>
                    </div>
                    <div className="flex bottom">
                      <p>{translations[language].quantity} {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="total">
              <h3>{translations[language].deliveryFee}: ₪ {calculateDeliveryFee(orderDetails.addressType)}</h3>
              <h3>{translations[language].totalItems} {totalQuantities}</h3>
              <h3>{translations[language].subtotal}: ₪ {totalWithDelivery}</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="order-confirmation">
          <h2>{translations[language].orderConfirmation}</h2>
          <p>{translations[language].thankYouForOrder.replace('{name}', orderDetails.name)}</p>
          <p>{translations[language].orderSummary}</p>
          <ul>
            <li>{translations[language].phoneNumber} {orderDetails.phoneNumber}</li>
            <li>{translations[language].address} {orderDetails.address}</li>
            <li>{translations[language].paymentMethod} {orderDetails.paymentMethod}</li>
            <li>{translations[language].notes} {orderDetails.notes}</li>
            <li>{translations[language].deliveryFee}: ₪ {deliveryFee}</li>
          </ul>
          <h3>{translations[language].itemsOrdered}</h3>
          <div className="product-container">
            {cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  alt=""
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                  </div>
                  <div className="flex bottom">
                    <p>{translations[language].quantity} {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="total">
            <h3>{translations[language].totalItems} {totalQuantities}</h3>
            <h3>{translations[language].subtotal} ₪ {totalPrice}</h3>
          </div>
          <button className="btn" onClick={() => clearCart()}>
            {translations[language].finishOrder}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmitOrder;
