import React, { useState } from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import translations from '../translations/translations'; // Import translations
import { useStateContext } from '../context/StateContext'; // Import context for language state
import { urlFor } from '../lib/client';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa'; // Import the filter icon from react-icons
const Home = ({ products, bannerData, brands }) => {
  const { language } = useStateContext(); // Assuming language is managed in context
  const [selectedCategory, setSelectedCategory] = useState('all'); // State to track the selected category

  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  // Step 1: Extract all unique categories
  var allCategories = [...new Set(products.flatMap((product) => product.categories))];
  allCategories = allCategories.filter(category => category !== 'best seller');

  // Step 2: Filter products based on the selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((product) => product.categories.includes(selectedCategory));
    const displayedProducts = new Set();
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

 <div className='products-heading'>
        <h2>{translations[language].brands}</h2>
        <p>{translations[language].brandsDescription}</p>
      </div>
      {/* Brands Section */}
      <div className="brands-section">
        <div className="brands-container">
          {brands.slice(0,5).map((brand) => (
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


      <div className='products-heading'>
        <h2>{translations[language].bestSellingProducts}</h2>
        <p>{translations[language].makeupAndCosmetics}</p>
      </div>
      {/* Category Buttons */}

      <div className="category-buttons">
      <FaFilter className="filter-icon" />
        <button 
          className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          {translations[language].allCategories}
        </button>
        {allCategories.slice(0,6).map((category) => (
          category!=" " && category!=""  ?<button 
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>:<div></div>
        ))}
      </div>

    
      
      <div key="BEST SELLERS" className='category-section'>
        <h3 className='category-title'>{translations[language].exploreProducts}</h3>
        <div className='products-container'>
          {filteredProducts.map((product) => (
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
      
    
      {/* Render products grouped by their categories, excluding duplicates and those with same name as brand */}
      <div className='categories-container'>
        {allCategories
          .filter((category) => !brands.some((brand) => brand.name === category)) // Exclude categories that match brand names
          .map((category) => {
          const categoryProducts = products
            .filter((product) => product.categories.includes(category))
            .filter((product) => !displayedProducts.has(product._id)); // Exclude already displayed products

          // Add products to displayed list
          categoryProducts.forEach(product => displayedProducts.add(product._id));

          if (categoryProducts.length === 0) {
            return null; // Skip categories with no products to show
          }

          return (
            <div key={category} className='category-section'>
              <h3 className='category-title'>{category}</h3>
              <div className='products-container'>
                {categoryProducts.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
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

export default Home;
