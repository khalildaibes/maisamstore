import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import { urlFor, client as sanityClient } from "../lib/client";
import { fetchStrapiData, getImageUrl, strapiClient, addStrapiData } from "../lib/strapiClient"; // Import Strapi helpers
import translations from '../translations/translations';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';
const SubmitOrder = ({ products, bannerData, brands }) => {
  const { cartItems, totalPrice, totalQuantities, language, clearCart } = useStateContext();

  const [orderDetails, setOrderDetails] = useState({
    phoneNumber: "",
    retypephoneNumber: "",
    name: "",
    addressType: "",
    address: "",
    street: "",
    city: "",
    paymentMethod: "",
    notes: "",
  });

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const isStrapiClient = true;

  const calculateDeliveryFee = (addressType) => {
    if (addressType === "ARAB_48") {
      return 35;
    } else if (addressType === "West_Bank") {
      return 55;
    }
    return 0;
  };

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

    if (orderDetails.retypephoneNumber !== orderDetails.phoneNumber) {
      alert('Retyped phone number must match the phone number.');
      return;
    }

    if (!window.confirm('Are you sure you want to submit the order?')) {
      return;
    }

    // Check storage status
    const status = await checkStorage();
    if (status) {
      // Add order to database
      await addOrder();
      // TODO: chnage email sending  mechanisoim
      sendEmail();
      setOrderSubmitted(true);
    }
    else {
      console.log("what ?")
    }
  };

  const sendEmail = () => {
    orderDetails.subtotal = totalWithDelivery;
    const message = {
      "to_name": "Khalil & yousef",
      "from_name": "new order",
      "totalWithDelivery": totalWithDelivery,
      "buyername": orderDetails.name,
      "message": cartItems.map(item => `
        product: ${item.name} 
        quantity: ${item.quantity}
        `).join("                         ") + "   " + JSON.stringify(orderDetails, null, 2),
    };

    emailjs.send('service_fiv09zs', 'template_gtronog', message, 'XNc8KcHCQwchLLHG5')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Thank you for your purchase!');
      }, (error) => {
        console.error('FAILED...', error);
        alert('Oops, we did not complete the purchase.');
      });
  };



  const addOrder = async () => {
    // const isStrapiClient = process.env.STRAPI_CLIENT === 'true';
    const isStrapiClient = true;
    const orderData = {
      status: 'Pending',
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
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        _key: uuidv4(),
      })),
    };

    try {
      if (isStrapiClient) {
        // Create the order in Strapi
        const response = await addStrapiData('/Orderdetailss', orderData);
        console.log('Order saved to Strapi:', response.data);
      } else {
        // Create the order in Sanity
        await sanityClient.create({
          _type: 'orderDetails',
          ...orderData,
        });
        console.log('Order saved to Sanity');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  const checkStorage = async () => {
    let status = true;
    const isStrapiClient = true;
    console.log("process.env.STRAPI_CLIENT", process.env.STRAPI_CLIENT === "true")

    await Promise.all(
      cartItems.map(async (item) => {
        let product;
        console.log("tryong to buy", item)

        if (isStrapiClient) {
          // Fetch product data from Strapi
          try {
            const productData = await fetchStrapiData('/products', { 'pagination[pageSize]': 100, 'filters': { 'documentId': { $eq: item.documentId } } });


            product = productData.data; // Assuming Strapi's response structure
          } catch (error) {
            console.error('Error fetching product from Strapi:', error);
          }
        } else {

          // Fetch product data from Sanity
          try {
            product = await sanityClient
              .fetch(`*[_type == "product" && _id == "${item._id}"]`)
              .then(result => result[0]);
          } catch (error) {
            console.error('Error fetching product from Sanity:', error);
          }
        }

        if (!product || product.quantity < item.quantity) {
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
          {/* Order Summary */}
          <div className="order-summary">
            <h3>{translations[language].yourCart}</h3>
            <div className="product-container">
              {cartItems.map((item) => (
                <div className="product" key={item._id || item.id}>
                  <img
                    src={isStrapiClient ? `https://server.yousef-style.shop${item.image[0].url}` : getImageUrl(item.image[0])}
                    alt={item.name}
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
              <h3>{translations[language].deliveryFee}: ₪ {deliveryFee}</h3>
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
                  src={isStrapiClient ? `https://server.yousef-style.shop${item.image[0].url}` : getImageUrl(item.image[0])}
                  alt={item.name}
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

// Fetch data for Strapi or Sanity based on environment variable
export const getServerSideProps = async () => {
  if (process.env.STRAPI_CLIENT === 'true') {
    try {
      const productsData = await fetchStrapiData('/products', { 'pagination[pageSize]': 100, 'populate': '*' });
      const bannerData = await fetchStrapiData('/banners', { 'pagination[pageSize]': 100, 'populate': '*' });
      const brandsData = await fetchStrapiData('/brands', { 'pagination[pageSize]': 100, 'populate': '*' });

      return {
        props: {
          products: productsData.data,
          bannerData: bannerData.data,
          brands: brandsData.data,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      return {
        props: {
          products: [],
          bannerData: [],
          brands: [],
        },
      };
    }
  } else {
    try {
      const bannerQuery = '*[_type == "banner"]';
      const bannerData = await sanityClient.fetch(bannerQuery);
      const brandsQuery = '*[_type == "brand"]';
      const brands = await sanityClient.fetch(brandsQuery);
      const productsQuery = '*[_type == "product"]';
      const products = await sanityClient.fetch(productsQuery);

      return {
        props: {
          products,
          bannerData,
          brands,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Sanity:', error);
      return {
        props: {
          products: [],
          bannerData: [],
          brands: [],
        },
      };
    }
  }
};

export default SubmitOrder;
