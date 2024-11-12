import React from 'react';
import { client as sanityClient } from '../lib/client';
import { Product } from '../components';
import { useRouter } from 'next/router';
import { fetchStrapiData } from '../lib/strapiClient'; // Import Strapi helper function

const CategoryPage = ({ products, category }) => {
  const router = useRouter();
  const { categoryName } = router.query; // Get category name from query parameter

  return (
    <div className='category-page-container'>
      <div className='products-heading'>
        <h2>{categoryName}</h2>
        <p>Discover a variety of products in {categoryName}</p>
      </div>

      <div className='products-container'>
        {products?.map((product) => (
          <Product key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Fetch data based on the category query parameter
export const getServerSideProps = async (context) => {
  const { categoryName } = context.query; // Get category name from query parameter

  if (process.env.STRAPI_CLIENT === 'true') {
    try {
      // Fetch products filtered by category from Strapi

      const productsData = await fetchStrapiData('/products', {
        'pagination[pageSize]': 100,
        'populate': '*',
        'filters[categories][$contains]': categoryName, // Adjust the field and value as needed
              });
      console.error('productsData ',productsData.data);

      return {
        props: {
          products: productsData.data,
          category: categoryName,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      return {
        props: {
          products: [],
          category: categoryName,
        },
      };
    }
  } else {
    try {
      // Fetch products filtered by category from Sanity
      const query = `*[_type == "product" && "${categoryName}" in categories]`;
      const products = await sanityClient.fetch(query);

      return {
        props: {
          products,
          category: categoryName,
        },
      };
    } catch (error) {
      console.error('Error fetching data from Sanity:', error);
      return {
        props: {
          products: [],
          category: categoryName,
        },
      };
    }
  }
};

export default CategoryPage;
