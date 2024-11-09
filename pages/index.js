import React, { useState } from 'react';
import { client } from '../lib/client'; // Sanity client
import { fetchStrapiData } from '../lib/strapiClient'; // Import Strapi helper function
import { Product, FooterBanner, HeroBanner } from '../components';
import translations from '../translations/translations'; // Import translations
import { useStateContext } from '../context/StateContext'; // Import context for language state
import { urlFor } from '../lib/client';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa'; // Import the filter icon from react-icons

const Home = ({ products, bannerData, brands }) => {
  const { language } = useStateContext(); // Assuming language is managed in context
  const [selectedCategory, setSelectedCategory] = useState('all'); // State to track the selected category

  const maisamMakeupBrand = brands.find((brand) => brand.name === "Maisam Makeup");
  const sephora = brands.find((brand) => brand.name === "SEPHORA");

  return (
    <>
      {/* <HeroBanner heroBanner={bannerData.length && bannerData[0]} /> */}

      <div className='products-heading'>
        <h2>{translations[language].brands}</h2>
        <p>{translations[language].brandsDescription}</p>
      </div>
      {/* Brands Section */}
      <div className="brands-section">
        <div className="brands-container">
          {/* <Link key={`Link_${maisamMakeupBrand.id}`} href={`/catgeory_products?categoryName=${maisamMakeupBrand.name}`}>
            <div key={maisamMakeupBrand.id} className="brand-item">
              <div className="brand-image-container">
                <img src={urlFor(maisamMakeupBrand.image[0])} alt={maisamMakeupBrand.name} className="brand-image" />
                <div className="brand-name">{maisamMakeupBrand.name}</div>
              </div>
            </div>
          </Link> */}

          {brands.filter((brand) => brand.name !== "Maisam Makeup" && brand.name !== "SEPHORA").map((brand) => (
            <Link key={`Link_${brand.id}`} href={`/catgeory_products?categoryName=${brand.name}`}>
              <div key={brand.id} className="brand-item">
                <div className="brand-image-container">
                  <img src={`http://165.227.147.87:1337/${brand.image[0].url}`} alt={brand.name} className="brand-image" />
                  <div className="brand-name">{brand.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div className='aboutSection'>
        <h2>{translations[language].aboutUs}</h2>
        <p>{translations[language].aboutUsDescription}</p>
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
    </>
  );
};

// Fetch data from Sanity or Strapi
export const getServerSideProps = async () => {
  if (process.env.STRAPI_CLIENT === 'true') {
    // Fetch data from Strapi using helper function
    try {
      const productsData = await fetchStrapiData('/products', { 'populate': '*' });
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
    // Fetch data from Sanity
    const bannerQuery = '*[_type == "banner"]';
    const bannerData = await client.fetch(bannerQuery);
    const brandsQuery = '*[_type == "brand"]'; // Fetch brands from "brand" schema
    const brands = await client.fetch(brandsQuery);

    return {
      props: {
        // Add your products fetching logic for Sanity if needed
        products: [], // Replace with Sanity product query if needed
        bannerData,
        brands,
      },
    };
  }
};

export default Home;
