import React from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';

const Home = ({ products, bannerData }) => {
  // Step 1: Extract all unique categories
  var allCategories = [...new Set(products.flatMap((product) => product.categories))];
  allCategories = allCategories.filter(category => category !== 'best seller');

  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
    
      <div className='products-heading'>
        <h2>Best Selling Products</h2>
        <p>Makeup and cosmetics of many variations</p>
      </div>
      <div key="BEST SELLERS" className='category-section'>
            <h3 className='category-title'>Explore our wide range of makeup products from top brands</h3>
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
        <h2>About Us</h2>
        <p>
          We are committed to providing the best makeup products to enhance your beauty. Our products are sourced from top brands and are guaranteed to be of the highest quality.
        </p>
        <div className='aboutImages'>
          <img src="/makeup1.jpg" alt="Makeup Products" />
          <img src="/makeup2.jpg" alt="Makeup Application" />
          <img src="/makeup3.jpg" alt="Makeup Kit" />
        </div>
      </div>
       {/* Testimonials Section */}
       <div className='testimonialsSection'>
        <h2>شو بحكو زبايينا عنا؟</h2>
        <div className='testimonials'>
          <div className='testimonial'>
            <p>"منتجات رائعة وخدمة ممتازة! بنصح فيهم كتير!
            "</p>
            <span>- عروب دقدوقي</span>
          </div>
          <div className='testimonial'>
            <p>"لقيت كل ماركاتي المفضلة هون وبأسعار ممتازة."</p>
            <span>- ميس دعيبس</span>
          </div>
        </div>
      </div>
      {/* Step 3: Render products grouped by their categories */}
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
      <h2>لماذا تشترون من عندنا؟</h2>
      <ul>
        <li>منتجات عالية الجودة من علامات تجارية موثوقة مثل Fenty Beauty, Glossier, Huda Beauty, وNARS</li>
        <li>أسعار تنافسية وعروض حصرية</li>
        <li>شحن سريع وموثوق</li>
        <li>خدمة عملاء ممتازة وإمكانية إرجاع سهلة</li>
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
