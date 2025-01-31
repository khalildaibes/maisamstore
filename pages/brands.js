import React from 'react';
import { client as sanityClient } from '../lib/client';
import { Product } from '../components';
import { useRouter } from 'next/router';
import translations from '../translations/translations'; // Import translations
import { useStateContext } from '../context/StateContext';
import Link from 'next/link';
import { getImageUrl, fetchStrapiData } from '../lib/strapiClient'; // Import Strapi helper function

const BrandPage = ({ brands }) => {
  const { language, changeLanguage } = useStateContext();

  const toggleLanguage = () => {
    // Toggle between English ('en'), Arabic ('ar'), and Hebrew ('he')
    if (language === 'en') {
      changeLanguage('ar');
    } else if (language === 'ar') {
      changeLanguage('he');
    } else {
      changeLanguage('en');
    }
    // Additional logic to handle language change (e.g., updating content, storing preference)
  };

  const router = useRouter();

  const isStrapiClient = process.env.STRAPI_CLIENT === 'true';

  return (
    <div className='brand-page-container'>
      <div className='products-heading'>
        <h2>{translations[language].brands}</h2>
        <p>Discover a variety of products in {translations[language].brands}</p>
      </div>

          {brands.map((brand) => (
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
  );
};

// Fetch data based on the brand query parameter
export const getServerSideProps = async (context) => {
  if (process.env.STRAPI_CLIENT === 'true') {
    try {
      // Fetch brands from Strapi
      const brandsData = await fetchStrapiData('/brands', { 'pagination[pageSize]': 100, 'populate': '*' });

      return {
        props: {
          brands: brandsData.data,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      return {
        props: {
          brands: [],
        },
      };
    }
  } else {
    try {
      // Fetch brands from Sanity
      const brandsQuery = '*[_type == "brand"]'; // Fetch brands from "brand" schema
      const brands = await sanityClient.fetch(brandsQuery);

      return {
        props: {
          brands,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Sanity:', error);
      return {
        props: {
          brands: [],
        },
      };
    }
  }
};

export default BrandPage;
