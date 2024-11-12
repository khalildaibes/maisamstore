import React, { useState, useEffect } from 'react';
import { client as sanityClient } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import translations from '../translations/translations';
import { useStateContext } from '../context/StateContext';
import { getImageUrl, fetchStrapiData } from '../lib/strapiClient'; // Adjust the path as necessary
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa';

const Home = ({ products, bannerData, brands }) => {
  const { language } = useStateContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isStrapiClient = process.env.STRAPI_CLIENT === 'true';

  const maisamMakeupBrand = brands.find((brand) => brand.name === "Maisam Makeup");
  const sephora = brands.find((brand) => brand.name === "SEPHORA");

  return (
    <>
      <div className='products-heading'>
        <h2>{translations[language].brands}</h2>
        <p>{translations[language].brandsDescription}</p>
      </div>

      {/* Brands Section */}
      <div className="brands-section">
        <div className="brands-container">
          {maisamMakeupBrand && (
            <Link key={`Link_${maisamMakeupBrand.id || maisamMakeupBrand._id}`} href={`/catgeory_products?categoryName=${maisamMakeupBrand.name}`}>
              <div key={maisamMakeupBrand.id || maisamMakeupBrand._id} className="brand-item">
                <div className="brand-image-container">
                  <img
                    src={isStrapiClient ? process.env.NEXT_PUBLIC_STRAPI_API_URL + maisamMakeupBrand.image[0].url : getImageUrl(maisamMakeupBrand.image[0])}
                    alt={maisamMakeupBrand.name}
                    className="brand-image"
                  />
                  <div className="brand-name">{maisamMakeupBrand.name}</div>
                </div>
              </div>
            </Link>
          )}

          {brands.filter((brand) => brand.name !== "Maisam Makeup" && brand.name !== "SEPHORA").map((brand) => (
            <Link key={`Link_${brand.id || brand._id}`} href={`/catgeory_products?categoryName=${brand.name}`}>
              <div key={brand.id || brand._id} className="brand-item">
                <div className="brand-image-container">
                  <img
                    src={isStrapiClient ? process.env.NEXT_PUBLIC_STRAPI_API_URL + brand.image[0].url : getImageUrl(brand.image[0])}
                    alt={brand.name}
                    className="brand-image"
                  />
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
        <div className='aboutImages'></div>
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
      const productsQuery = '*[_type == "product"]';
      const products = await sanityClient.fetch(productsQuery);

      const bannerQuery = '*[_type == "banner"]';
      const bannerData = await sanityClient.fetch(bannerQuery);

      const brandsQuery = '*[_type == "brand"]';
      const brands = await sanityClient.fetch(brandsQuery);

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

export default Home;
