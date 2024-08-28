// Putting a [name] makes the file dynamic
// File based routing

import React, { useState } from "react";

import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { client, urlFor } from "../../lib/client";

import { Product } from "../../components";

import { useStateContext } from '../../context/StateContext'; 



const ProductDetails = ({ product, products}) => {
const { image, name, details, price, colors } = product;

const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();
const [index, setIndex] = useState(0);
const [selectedColor, setSelectedColor] = useState(null);

const handleColorClick = (color) => {
  setSelectedColor(color);
};

const handleBuyNow = () => { 
  onAdd(product, qty); 

  setShowCart(true); 
}
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className=
                {i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            {/* TODO(KHALIL) : change here to dynamic */}
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">₪ {price}</p>
          <div className="product-colors">
            {colors && colors.map((item, index) => (
              <div
                key={index}
                className="color-circle"
                style={{ backgroundColor: item.name }}
                title={item.name} // Tooltip to show the color name on hover
                onClick={() => handleColorClick(item)} // Store the selected color on click
              />
            ))}
            {selectedColor && (
              <p>You selected: {<div
                className="color-circle"
                style={{ backgroundColor: selectedColor.name }}
                title={selectedColor.name} // Tooltip to show the color name on hover
              />}</p>
            )}
          </div>
            <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              {/* Minus button */}
            <span className="minus" onClick={decQty}><AiOutlineMinus /></span> 
            {/* Quantity display */}
              <span className="num">{qty}</span>
              {/* Plus button */}
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            {/* Add to cart button */}
          <button type="button" className="add-to-cart" onClick={() => onAdd(product, qty)}>Add to Cart</button>

            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Product banner for similar items to the selected items */}
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
          {products.map((item) => (
                <Product key={item._id} product={item} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// getStaticProps function is used when the data required to render the page is available at runtime ahead of user request

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

//To fetch product details from thne product page we are on currently
export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`; //Fetching a particular product requested
  const productsQuery = '*[_type == "product"]'; //Fetching similar products

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  // console.log(product);

  return {
    props: { product, products },
  };
};

export default ProductDetails;
