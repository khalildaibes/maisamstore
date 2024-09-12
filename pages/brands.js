import React from 'react';
import { client } from '../lib/client';
import { Product } from '../components';
import { useRouter } from 'next/router';
import translations from '../translations/translations'; // Import translations
import { useStateContext } from '../context/StateContext';
import Link from 'next/link';
import { urlFor } from '../lib/client';

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
  const { brandName } = router.query; // Get brand name from query parameter

  return (
    <div className='brand-page-container'>
      <div className='products-heading'>
        <h2>{translations[language].brands}</h2>
        <p>Discover a variety of products in {translations[language].brands}</p>
      </div>

      {/* Brands Section */}
      <div className="brands-section">
        <div className="brands-container">
          {brands.map((brand) => (
            <Link  key={`Link_${brand._id}}`} href={`/catgeory_products?categoryName=${brand.name}`}>
            
            <div key={brand._id} className="brand-item">
              <div className="brand-image-container">
                <img src={urlFor(brand.image[0])} alt={brand.name} className="brand-image" />
                <div className="brand-name">{brand.name}</div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
        
    </div>
  );
};

// Fetch data based on the brand query parameter
export const getServerSideProps = async (context) => {
  const { brandName } = context.query; // Get brand name from query parameter

  const brandsQuery = '*[_type == "brand"]'; // Fetch brands from "brand" schema
  const brands = await client.fetch(brandsQuery);

  return {
    props: { brands }
  };
};

export default BrandPage;
