import React, { useState, useEffect } from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import translations from '../translations/translations'; // Import translations
import { useStateContext } from '../context/StateContext'; // Import context for language state
import { urlFor } from '../lib/client';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa'; // Import the filter icon from react-icons
const Home = ({ products, bannerData, brands }) => {
  const { language, categories, expanded, toggleExpand, fetchCategories } = useStateContext();

  const [visibleCategories, setVisibleCategories] = useState([]);

  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Handle category visibility when categories or expanded state changes
    if (categories) {
      setVisibleCategories(expanded ? Object.keys(categories) : Object.keys(categories).slice(0, 3));
    }
  }, [categories, expanded]);



  const [selectedCategory, setSelectedCategory] = useState('all'); // State to track the selected category

  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  // Step 1: Extract all unique categories
  var allCategories = [...new Set(products.flatMap((product) => product.categories))];
  allCategories = allCategories.filter(category => category !== 'best seller');

  // Step 2: Filter products based on the selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((product) => product.categories.find((c)=>c.trim().includes(selectedCategory.trim())));
    const displayedProducts = new Set();


    const maisamMakeupBrand = brands.find((brand) => brand.name === "Maisam Makeup");
    const sephora = brands.find((brand) => brand.name === "SEPHORA");
    return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

 <div className='products-heading'>
        <h2>{translations[language].brands}</h2>
        <p>{translations[language].brandsDescription}</p>
      </div>
      <div className="wrapper">
  </div>
      {/* Brands Section */}
      <div className="brands-section">
        <div className="brands-container">
        {/* <Link  key={`Link_${maisamMakeupBrand._id}}`} href={`/catgeory_products?categoryName=${maisamMakeupBrand.name}`}>
            
            <div key={maisamMakeupBrand._id} className="brand-item">
              <div className="brand-image-container">
                <img src={urlFor(maisamMakeupBrand.image[0])} alt={maisamMakeupBrand.name} className="brand-image" />
                <div className="brand-name">{maisamMakeupBrand.name}</div>
              </div>
            </div>
            </Link> */}
              
          {brands.filter((brand)=> brand.name!="Maisam Makeup" && brand.name!="SEPHORA" ).map((brand) => (
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
{/* Dynamic Section for Services */}
<section className="services-section">
        <div className="service-item">
          <img src='/truck-stroke-rounded.svg' alt={translations[language].fastDelivery} width={30} height={30}/>
          <h3>{translations[language].fastDelivery}</h3>
          <p>{translations[language].fastDeliveryDescription}</p>
        </div>
        <div className="service-item">
          <img src="/location-01-stroke-rounded.svg" alt={translations[language].selfPickup} width={30} height={30} /> 
          <h3>{translations[language].selfPickup}</h3>
          <p>{translations[language].selfPickupDescription}</p>
        </div>
        <div className="service-item">
          <img src="/security-check-stroke-rounded.svg" alt={translations[language].securePayment} width={30} height={30} /> 
          <h3>{translations[language].securePayment}</h3>
          <p>{translations[language].securePaymentDescription}</p>
        </div>
        <div className="service-item">
          <img src="/customer-support-stroke-rounded.svg" alt={translations[language].customerSupport} width={30} height={30} /> 
          <h3>{translations[language].customerSupport}</h3>
          <p>{translations[language].customerSupportDescription}</p>
        </div>
      </section>

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

        {allCategories.map((category) => (
          category!=" " && category!=""&& !brands.some((brand)=>brand.name.trim() === category.trim()) 
          ?
          <button 
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
          :
          null
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
          <img src="/clean0.jpeg" alt="Makeup Products" />
          <img src="/clean3.jpeg" alt="Makeup Application" />
          <img src="/clean2.jpeg" alt="Makeup Kit" />
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
          .filter((category) => !brands.some((brand) => brand.name.trim() === category.trim())) // Exclude categories that match brand names
          .map((category) => {
          const categoryProducts = products
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
      
      <section>
      <iframe src="https://embed.waze.com/iframe?zoom=13&lat=32.751917&lon=35.345917&pin=1"
            width="100%" height="520"></iframe>
      </section>

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
