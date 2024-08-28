import React from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import translations from '../translations/translations'; // Import translations
import { useStateContext } from '../context/StateContext'; // Import context for language state

const Home = ({ products, bannerData }) => {
  const { language } = useStateContext(); // Assuming language is managed in context
  
  // Step 1: Extract all unique categories
  var allCategories = [...new Set(products.flatMap((product) => product.categories))];
  allCategories = allCategories.filter(category => category !== 'best seller');
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
    
      <div className='products-heading'>
        <h2>{translations[language].bestSellingProducts}</h2>
        <p>{translations[language].makeupAndCosmetics}</p>
      </div>
      
      <div key="BEST SELLERS" className='category-section'>
        <h3 className='category-title'>{translations[language].exploreProducts}</h3>
        <div className='products-container'>
          {products
            .filter((product) => product.categories.includes("best seller"))
            .map((product) => (
              <Product key={product._id} product={product} />
            ))}
        </div>
      </div>
      
      {/* About Us Section */}
      <div className='aboutSection'>
        <h2>{translations[language].aboutUs}</h2>
        <p>{translations[language].aboutUsDescription}</p>
        <div className='aboutImages'>
          <img src="/makeup1.jpg" alt="Makeup Products" />
          <img src="/makeup2.jpg" alt="Makeup Application" />
          <img src="/makeup3.jpg" alt="Makeup Kit" />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className='testimonialsSection'>
        <h2>{translations[language].testimonialsTitle}</h2>
        <div className='testimonials'>
          <div className='testimonial'>
            <p>{translations[language].testimonial1}</p>
            <span>{translations[language].testimonialName1}</span>
          </div>
          <div className='testimonial'>
            <p>{translations[language].testimonial2}</p>
            <span>{translations[language].testimonialName2}</span>
          </div>
        </div>
      </div>
      
      {/* Render products grouped by their categories */}
      <div className='categories-container'>
        {allCategories.map((category) => (
          <div key={category} className='category-section'>
            <h3 className='category-title'>{category}</h3>
            <div className='products-container'>
              {products
                .filter((product) => product.categories.includes(category))
                .map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Why Buy From Us Section */}
      <div className='whyBuySection'>
        <h2>{translations[language].whyBuyFromUs}</h2>
        <ul>
          <li>{translations[language].highQualityProducts}</li>
          <li>{translations[language].competitivePrices}</li>
          <li>{translations[language].fastShipping}</li>
          <li>{translations[language].excellentCustomerService}</li>
        </ul>
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </>
  );
};

// Fetch data from Sanity
export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  };
};

export default Home;
