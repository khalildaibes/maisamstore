import React, { useState } from "react";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import translations from '../translations/translations'; // Import translations

const SubmitOrder = () => {
  const { cartItems, totalPrice, totalQuantities, language } = useStateContext(); // Get language from context
  const [orderDetails, setOrderDetails] = useState({
    phoneNumber: "",
    name: "",
    address: "",
    paymentMethod: "",
    notes: "",
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!orderDetails.name || !orderDetails.phoneNumber || !orderDetails.address) {
      alert('Please fill out all required fields.');
      return;
    }

    // Prepare data for API call
    const data = {
      "messaging_product": "whatsapp",
      "to": orderDetails.phoneNumber,
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
                "text": orderDetails.phoneNumber
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
        body: JSON.stringify(data), // Corrected payload
      });

      const result = await response.json();

      if (response.ok) {
        console.log('WhatsApp message sent successfully:', result);
        alert('Order submitted successfully and WhatsApp message sent!');
        // Clear form fields or redirect as needed
       
        setOrderSubmitted(true);
      } else {
        console.error('Error sending WhatsApp message:', result);
        alert('Failed to send WhatsApp message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the order. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

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
              <label htmlFor="address">{translations[language].address}</label>
              <input
                type="text"
                id="address"
                name="address"
                value={orderDetails.address}
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
                    className="cart-product-image"
                  />
                  <div className="item-desc">
                    <div className="flex top">
                      <h5>{item.name}</h5>
                      <h4>₪ {item.price}</h4>
                    </div>
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
          </ul>
          <h3>{translations[language].itemsOrdered}</h3>
          <div className="product-container">
            {cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                  </div>
                  <div className="flex top">
                    <h4>₪ {item.price}</h4>
                  </div>
                  
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
          <button className="btn" onClick={() => setOrderSubmitted(false)}>
            {translations[language].editOrder}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmitOrder;
