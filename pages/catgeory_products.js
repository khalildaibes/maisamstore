import React from 'react';
import { client } from '../lib/client';
import { Product } from '../components';
import { useRouter } from 'next/router';
import { fetchStrapiData } from '../lib/strapiClient'; // Import Strapi helper function

const CategoryPage = ({ products, category }) => {
  console.log(products);

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
          <Product key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Fetch data based on the category query parameter
export const getServerSideProps = async (context) => {
  const { categoryName } = context.query; // Get category name from query parameter
  if (process.env.STRAPI_CLIENT === 'true') {
    let page = 1; // Initialize the page variable
    let products = [];
    let hasMore = true;
    console.error("categoryName")

    try {
      while (hasMore) {
        const data = await fetchStrapiData('/products', {
          'pagination[page]': page,
          'pagination[pageSize]': 100,
          'populate': '*',
          // 'filters[categories][$contains]': categoryName, // Filter by category name

        });

        products.push(...data.data); // Accumulate products

        // Check if there are more pages
        if (page >= data.meta.pagination.pageCount) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      return {
        props: {
          products,
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
    // Fetching data from Sanity
    const query = `*[_type == "product" && $categoryName in categories]`;
    const products = await client.fetch(query, { categoryName });

    return {
      props: { products, category: categoryName },
    };
  }
};

export default CategoryPage;
