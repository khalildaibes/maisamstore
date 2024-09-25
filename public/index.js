import React, { useState, useEffect } from 'react';
import { client } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import { Product, FooterBanner, HeroBanner ,Popup} from '../components'; 
import translations from '../translations/translations'; // Import translations
import Customer from '../assets/customer-support-stroke-rounded.svg'; // Adjust the path if needed
import Location from '../assets/location-01-stroke-rounded.svg'; // Adjust the path if needed
import Security from '../assets/security-check-stroke-rounded.svg'; // Adjust the path if needed
import Truck from '../assets/customer-support-stroke-rounded.svg'; // Adjust the path if needed
import dynamic from 'next/dynamic';
const Home = ({ products, bannerData }) => {
  const { language } = useStateContext();
  const [showPopup, setShowPopup] = useState(false);

  // Check if it's the user's first visit and show the popup
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('firstVisit') === null;
    if (isFirstVisit) {
      setShowPopup(true);
      localStorage.setItem('firstVisit', 'no');
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };
 
  return (
    <> 
      {showPopup && <Popup onClose={closePopup} />} {/* Render the popup if showPopup is true */}
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />   


      
  {/* New Section with Hebrew Text */}
  <section className="services-section">
        <div className="service-item">

        <div>
        <img src={Truck} alt="Truck Icon" width={150} height={150} /> 
    </div>                  <h3>משלוח מהיר</h3>
          <p>משלוח מהיר לכל רחבי הארץ</p>
        </div>
        <div className="service-item">
        <img src={Truck} alt="Truck Icon" width={150} height={150} /> 
                        <h3>איסוף עצמי</h3>
          <p>ברוכים הבאים לקלינלינס לאסוף את המוצרים שלכם</p>
        </div>
        <div className="service-item">
       
        <img src={Truck} alt="Truck Icon" width={150} height={150} />           
          <h3>תשלום מאובטח</h3>
          <p>אנו מבטיחים תשלום מאובטח עם כל שיטות התשלום</p>
        </div>
        <div className="service-item">

        <img src={Truck} alt="Truck Icon" width={150} height={150} />    
                         <h3>תמיכה 24/7</h3>
          <p>צור איתנו קשר 24 שעות ביממה, 7 ימים בשבוע</p>
        </div>
      </section>





      <div className='products-heading'> 
        <h2>{translations[language].bestProducts}</h2>
        <p>{translations[language].bestCleaningTools}</p>
      </div>







      <div className='products-container'> 
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
     

      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </>
  );
}

export const getServerSideProps = async () => { 
  const query = '*[_type == "product"]'; 
  const products = await client.fetch(query); 

  const bannerQuery = '*[_type == "banner"]'; 
  const bannerData = await client.fetch(bannerQuery); 

  return { 
    props: { products, bannerData }
  }
}

export default Home;
