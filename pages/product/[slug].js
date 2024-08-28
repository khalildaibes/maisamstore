import React, { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
  AiOutlineCheck,
  AiOutlineClose, // Import X icon
} from "react-icons/ai";
import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";
import { useStateContext } from '../../context/StateContext'; 
import translations from '../../translations/translations'; // Import translations

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, colors } = product;
  const { decQty, incQty, qty, onAdd, setShowCart, language } = useStateContext(); // Assuming language is managed in context
  const [index, setIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    if (color.quantity > 0) {  // Only allow selection if the color quantity is greater than 0
      setSelectedColor(color);
    }
  };

  const handleAddToCart = () => {
    if (colors != null) {
      if (colors.length > 0 && !selectedColor) {
        alert(translations[language].selectColorAlert);
        return;
      } else {
        onAdd(product, qty, selectedColor);
      }
    } else {
      onAdd(product, qty);
    }
  };

  const handleBuyNow = () => {
    if (colors != null) {
      if (colors.length > 0 && !selectedColor) {
        alert(translations[language].selectColorAlert);
        return;
      } else {
        onAdd(product, qty, selectedColor);
        setShowCart(true);
      }
    } else {
      onAdd(product, qty);
      setShowCart(true);
    }
  };

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
                className={i === index ? 'small-image selected-image' : 'small-image'}
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
            {/* TODO: Make reviews dynamic */}
            <p>{translations[language].reviews}</p>
          </div>
          <h4>{translations[language].details}</h4>
          <p>{details}</p>
          <p className="price">₪ {price}</p>

          <div className="product-colors">
            {colors && colors.map((item, index) => (
              <div
                key={index}
                className={`color-circle ${item.quantity === 0 ? 'disabled' : ''}`}
                style={{ backgroundColor: item.name, position: 'relative' }}
                title={item.name}
                onClick={() => handleColorClick(item)}
              >
                {item.quantity === 0 && (
                  <AiOutlineClose
                    style={{
                      color: 'red', // 'X' sign for out of stock
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '1.5rem', // Adjust the size as needed
                    }}
                  />
                )}
              </div>
            ))}
            {selectedColor && (
              <p>
                {translations[language].selectedColor}
                <div
                  className="color-circle"
                  style={{ backgroundColor: selectedColor.name }}
                  title={selectedColor.name}
                />
              </p>
            )}
          </div>

          <div className="quantity">
            <h3>{translations[language].quantity}</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>

          <div className="buttons">
            <button type="button" className="add-to-cart" onClick={handleAddToCart}>
              {translations[language].addToCart}
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              {translations[language].buyNow}
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>{translations[language].youMayAlsoLike}</h2>
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

// Static path and prop fetching functions remain unchanged

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

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

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { product, products },
  };
};

export default ProductDetails;
