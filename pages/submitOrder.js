import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import { urlFor, client } from "../lib/client";
import translations from '../translations/translations'; // Import translations
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique keys

const SubmitOrder = (products, bannerData, brands) => {
  const { cartItems, totalPrice, totalQuantities, language, clearCart } = useStateContext(); // Get language from context

  const [orderDetails, setOrderDetails] = useState({
    phoneNumber: "",
    retypephoneNumber: "", // New field for retype password
    name: "",
    addressType: "",
    address: "",
    street: "",
    city: "",
    paymentMethod: "",
    notes: "",
    subtotal: "",
    cart: "",
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
    const phoneNumberRegex = /^05\d{8}$/;
    if (!phoneNumberRegex.test(orderDetails.phoneNumber)) {
      alert('Please enter a valid phone number starting with "05" and exactly 10 digits.');
      return;
    }
    
    // Validate retype password
    if (orderDetails.retypephoneNumber !== orderDetails.phoneNumber) {
      alert('Retyped phone number must match the phone number.');
      return;
    }

    // Show confirmation dialog before proceeding
    if (!window.confirm('Are you sure you want to submit the order?')) {
      return;
    }

    // Continue with the order submission
    var status = await checkStorage();
    if (status) {
      addOrder(event);
      cartItems.map(item => {
        client
        .patch(item._id) // Document ID to patch
        .set({"quantity": products.products.find((product)=> product._id === item._id)?.quantity - item.quantity }) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((item) => {
          console.log('document updated! New orer:')
          console.log(item)
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
        })});
      sendEmail(event);
      setOrderSubmitted(true);
      // createOrderEntregas({ orderdetailes: orderDetails })
    }
  };

  const decreaseFromDB = async (cartItems) => {

 
  };

  // Clear the form after sending
  
  const sendEmail = (e) => {
    e.preventDefault();
    orderDetails.subtotal = totalWithDelivery;
    var  message= {
      "to_name":"khalilok",
      "from_name":"new order",
      "totalWithDelivery":totalWithDelivery,
      "buyername":orderDetails.name,
      "message" :(cartItems.map(item => `
        product: ${item.name} 
        quantity: ${item.quantity}
        `).join("                         ") + "   "  + JSON.stringify(orderDetails, null, 2) )
    }

  

    emailjs.send('service_fiv09zs', 'template_t2r5twb', message, 'XNc8KcHCQwchLLHG5')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('תודה רבה לכם על הקנייה!');
      }, (error) => {
        console.error('FAILED...', error);
        alert('opps we didnt complete the purchase.');
      });

    // Clear the form after sending

  };

  const createOrderEntregas = async (orderDetails) => {
    try {
      // Make the POST request to the Next.js API route, passing the order details
      const response = await fetch('/api/delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails) // Send order details from the client
      });
  
      const result = await response.json();
  
      // Check if the response was successful
      if (response.ok) {
        console.log('Order created successfully:', result);
        // Handle success (e.g., clear form fields, redirect, etc.)
      } else {
        console.error('Error creating order:', result);
        // Handle error response
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors
    }
  };

  const addOrder = async (event) => {
    // Prepare the order data to be saved in Sanity
    const orderData = {
      _type: 'orderDetails',
      status: 'Pending', // Set initial status
      cost: totalWithDelivery,
      phoneNumber: orderDetails.phoneNumber,
      name: orderDetails.name,
      addressType: orderDetails.addressType,
      address: orderDetails.address,
      street: orderDetails.street,
      city: orderDetails.city,
      paymentMethod: orderDetails.paymentMethod,
      notes: orderDetails.notes || '',
      subtotal: totalPrice,
      cart: cartItems.map(item => ({
        _type: 'cartItem',
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        _key: uuidv4(), // Generate a unique key
      })),
    };

    try {
      // Save the order data to Sanity
      await client.create(orderData);
    } catch (error) {
      console.error('Error saving order to Sanity:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  const checkStorage = async (event) => {
    var status = true;

    // Use Promise.all to wait for all asynchronous operations to complete
    await Promise.all(
      cartItems.map(async (item) => {
        const product = await client
          .fetch(`*[_type == "product"  &&  _id == "${item._id}"]`) // Fetch the product's quantity
          .then(result => result[0]); // Access the first result
        if (!product.quantity > 0) {
          alert(translations[language].soldOut.replace('${item.name}', item.name));
          status = false;
        }
        if (product.quantity < item.quantity) {
          alert(translations[language].soldOut.replace('${item.name}', item.name));
          status = false;
        }
        if (product.quantity - item.quantity < 0) {
          alert(translations[language].soldOut.replace('${item.name}', item.name));
          status = false;
        }
      })
    );
    return status;
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
                type="tel" // Changed to "tel" for phone number input                id="phoneNumber"
                name="phoneNumber"
                value={orderDetails.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="retypephoneNumber">Retype Your phone Number</label>
              <input
                type="tel" // Changed to "tel" for phone number input
                id="retypephoneNumber"
                name="retypephoneNumber"
                value={orderDetails.retypephoneNumber}
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

// Fetch data from Sanity
export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);
  const brandsQuery = '*[_type == "brand"]'; // Fetch brands from "brand" schema
  const brands = await client.fetch(brandsQuery);

  return {
    props: { products, bannerData, brands }
  };
};

export default SubmitOrder;
