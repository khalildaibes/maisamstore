import React from 'react';
import { client } from '../lib/client';
import { Product } from '../components';
import { useRouter } from 'next/router';

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
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Fetch data based on the category query parameter
export const getServerSideProps = async (context) => {
  const { categoryName } = context.query; // Get category name from query parameter

  const query = `*[_type == "product" && "${categoryName}" in categories]`;
  const products = await client.fetch(query);

  return {
    props: { products, category: categoryName }
  };
};

export default CategoryPage;
