import React from 'react';
import { fetchStrapiData } from '../lib/strapiClient'; // Adjust the path as needed
const ProductsPage = ({ products }) => {
  return (
    <div>
      <h1>Products</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => {
        
          return (
            <div key={ product.documentId} style={cardStyle}>
              <h2>{product.name}</h2>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Categories: {product.categoryDisplay}</p>
              <p>Details: {product.details}</p>
              <p>ID : {product.documentId}</p>
              {/* <img src={`http://165.227.147.87:1337/${product.image[0].url}`} alt={product.name} className="brand-image" /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  width: '200px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};
// Fetch all products data from the Strapi API
export async function getServerSideProps() {
  const products = [];
  let page = 1;
  let hasMore = true;
  try {
    while (hasMore) {
      const data = await fetchStrapiData('/products', {
        'pagination[page]': page,
        'pagination[pageSize]': 100,
        'populate': '*',
      });
      products.push(...data.data);
      // Check if there are more pages
      if (page >= data.meta.pagination.pageCount) {
        hasMore = false;
      } else {
        page += 1;
      }
    }
    return {
      props: {
        products, // Returns the accumulated array of all products
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}
export default ProductsPage;