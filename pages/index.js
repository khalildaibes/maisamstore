import React, { useState, useEffect } from 'react';
import { client as sanityClient } from '../lib/client';
import translations from '../translations/translations';
import { useStateContext } from '../context/StateContext';
import { getImageUrl, fetchStrapiData } from '../lib/strapiClient';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import styles from '../styles/Home.module.css';

const Home = ({ brands, featuredProducts, testimonials }) => {
  const { language } = useStateContext();
  const isStrapiClient = 'true';

  // Mock data fallback for demo
  const demoBrands = [
    { id: 1, name: 'Radiant Glow', image: [{ url: '/images/hero-bg.jpg' }] },
    { id: 2, name: 'Pure Elegance', image: [{ url: '/images/brand-story.jpg' }] },
    { id: 3, name: 'Luxe Touch', image: [{ url: '/images/hero-bg.jpg' }] },
  ];
  const demoProducts = [
    { id: 1, name: 'Silk Foundation', image: [{ url: '/images/hero-bg.jpg' }], price: 39 },
    { id: 2, name: 'Velvet Lipstick', image: [{ url: '/images/brand-story.jpg' }], price: 22 },
    { id: 3, name: 'Glow Serum', image: [{ url: '/images/hero-bg.jpg' }], price: 29 },
    { id: 4, name: 'Hydra Mist', image: [{ url: '/images/brand-story.jpg' }], price: 19 },
  ];
  const demoTestimonials = [
    { name: 'Layla S.', title: 'Beauty Blogger', content: 'Wafaa Beauty products transformed my skin! I love the natural glow.', avatar: '/images/testimonial1.jpg' },
    { name: 'Mona A.', title: 'Makeup Artist', content: 'The foundation is so smooth and the lipstick lasts all day.', avatar: '/images/testimonial2.jpg' },
    { name: 'Sara K.', title: 'Customer', content: 'I get compliments every day. Highly recommend Wafaa Beauty!', avatar: '/images/testimonial3.jpg' },
  ];

  const brandsToShow = brands && brands.length > 0 ? brands : demoBrands;
  const productsToShow = featuredProducts && featuredProducts.length > 0 ? featuredProducts : demoProducts;
  const testimonialsToShow = testimonials && testimonials.length > 0 ? testimonials : demoTestimonials;

  return (
    <div className={styles.wafaaBeautyHome}>
      {/* Hero Section */}
      <motion.section 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.heroContent}>
          <h1>Wafaa Beauty</h1>
          <p>Discover Your Natural Radiance</p>
          <Link href="/products" className={styles.ctaButton}>
            Shop Collection
          </Link>
        </div>
      </motion.section>

      {/* Featured Categories */}
      <section className={styles.featuredCategories}>
        <h2>Our Collections</h2>
        <div className={styles.categoriesGrid}>
          {brandsToShow.map((brand) => (
            <motion.div
              key={brand.id || brand._id}
              className={styles.categoryCard}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/category_products?categoryName=${brand.name}`}>
                <div className={styles.categoryImage}>
                  <img
                    src={brand.image[0].url}
                    alt={brand.name}
                  />
                  <div className={styles.categoryOverlay}>
                    <h3>{brand.name}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className={styles.bestSellers}>
        <h2>Best Sellers</h2>
        <div className={styles.productsSlider}>
          {productsToShow?.map((product) => (
            <motion.div
              key={product.id}
              className={styles.productCard}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <img src={product.image[0].url} alt={product.name} />
              <h3>{product.name}</h3>
              <p className={styles.price}>${product.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className={styles.brandStory}>
        <div className={styles.storyContent}>
          <h2>Our Story</h2>
          <p>Wafaa Beauty is more than just a beauty brand - it's a celebration of natural beauty and self-expression. Our products are crafted with care, using only the finest ingredients to enhance your natural radiance.</p>
        </div>
        <div className={styles.storyImage}>
          <img src="/images/brand-story.jpg" alt="Wafaa Beauty Story" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What Our Customers Say</h2>
        <div className={styles.testimonialsGrid}>
          {testimonialsToShow?.map((testimonial, index) => (
            <motion.div
              key={index}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p>{testimonial.content}</p>
              <div className={styles.testimonialAuthor}>
                <img src={testimonial.avatar} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Media Section */}
      <section className={styles.socialMedia}>
        <h2>Follow Us</h2>
        <div className={styles.socialGrid}>
          <a href="https://instagram.com/wafaabeauty" className={styles.socialCard + ' ' + styles.instagram}>
            <FaInstagram />
            <span>@wafaabeauty</span>
          </a>
          <a href="https://tiktok.com/@wafaabeauty" className={styles.socialCard + ' ' + styles.tiktok}>
            <FaTiktok />
            <span>@wafaabeauty</span>
          </a>
          <a href="https://youtube.com/wafaabeauty" className={styles.socialCard + ' ' + styles.youtube}>
            <FaYoutube />
            <span>Wafaa Beauty</span>
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Join Our Beauty Community</h2>
          <p>Subscribe to receive exclusive offers, beauty tips, and new product launches.</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

// Fetch data for Strapi or Sanity based on environment variable
export const getServerSideProps = async () => {
  if (process.env.STRAPI_CLIENT === 'true') {
    try {
      const productsData = await fetchStrapiData('/products', { 
        'pagination[pageSize]': 8,
        'populate': '*',
        'filters[featured][$eq]': true 
      });
      const brandsData = await fetchStrapiData('/brands', { 
        'pagination[pageSize]': 100,
        'populate': '*' 
      });
      const testimonialsData = await fetchStrapiData('/testimonials', {
        'pagination[pageSize]': 3,
        'populate': '*'
      });

      return {
        props: {
          featuredProducts: productsData.data,
          brands: brandsData.data,
          testimonials: testimonialsData.data,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      return {
        props: {
          featuredProducts: [],
          brands: [],
          testimonials: [],
        },
      };
    }
  } else {
    // Sanity implementation remains the same
    try {
      const productsQuery = '*[_type == "product" && featured == true][0...8]';
      const products = await sanityClient.fetch(productsQuery);

      const brandsQuery = '*[_type == "brand"]';
      const brands = await sanityClient.fetch(brandsQuery);

      const testimonialsQuery = '*[_type == "testimonial"][0...3]';
      const testimonials = await sanityClient.fetch(testimonialsQuery);

      return {
        props: {
          featuredProducts: products,
          brands,
          testimonials,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Sanity:', error);
      return {
        props: {
          featuredProducts: [],
          brands: [],
          testimonials: [],
        },
      };
    }
  }
};

export default Home;
