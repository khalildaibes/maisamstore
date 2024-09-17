import React, { useState, useEffect } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
  AiOutlineClose,
} from "react-icons/ai";
import { client, urlFor, getUrlFromId } from "../../lib/client";
import { Product } from "../../components";
import { useStateContext } from '../../context/StateContext'; 
import translations from '../../translations/translations';
import { useRouter } from 'next/router';

function videoAssetFor(source) {
  return getFileAsset(source, client.config());
}

const ProductDetails = ({ productData, products }) => {
  const { image, name, details, price, colors, video } = productData;
  let { decQty, incQty, qty, onAdd, setShowCart, language } = useStateContext();
  const [product, setProduct] = useState(productData); // State to hold product data
  const [index, setIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const router = useRouter();

  const handleColorClick = (color) => {
    if (color.quantity > 0) {
      setSelectedColor(color);
    }
  };

  const handleAddToCart = () => {
    router.replace(router.asPath);
    if (product.quantity > 0) {
      if (product.quantity < qty) {
        alert("NO ENOUGH OF THIS PRODUCT IN STORE");
        return;
      }
      if (colors && colors.length > 0 && !selectedColor) {
        alert(translations[language].selectColorAlert);
        return;
      }
      onAdd(product, qty, selectedColor);
    } else {
      alert(translations[language].soldOut.replace('${item.name}', product.name));
      return;
    }
  };

  const handleBuyNow = () => {
    if (product.quantity > 0) {
      if (product.quantity < qty) {
        alert("NO ENOUGH OF THIS PRODUCT IN STORE");
        return;
      }
      if (colors && colors.length > 0 && !selectedColor) {
        alert(translations[language].selectColorAlert);
        return;
      }
      onAdd(product, qty, selectedColor);
      setShowCart(true);
    } else {
      alert(translations[language].soldOut.replace('${item.name}', product.name));
      return;
    }
  };

  // Function to fetch product data
  const fetchProductData = async () => {
    console.log("data updated");
    const query = `*[_type == "product" && _id == '${product._id}'][0]`; // Adjust query to fetch the product by ID
    const updatedProduct = await client.fetch(query);
    setProduct(updatedProduct);
    qty = updatedProduct.quantity;
  };

  // useEffect to poll the product data every few seconds
  useEffect(() => {
    const interval = setInterval(fetchProductData, 5000); // Fetch every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            {/* Conditional rendering to either show the image or the video */}
            {!isVideoSelected ? (
              <img
                src={urlFor(product.image && product.image[index])}
                className="product-detail-image"
                alt={product.name}
              />
            ) : (
              <video className="product-detail-image" controls>
                <source src={getUrlFromId(product.video[selectedVideoIndex].videoFile)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="small-images-container">
            {/* Map through the images */}
            {product.image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={i === index && !isVideoSelected ? 'small-image selected-image' : 'small-image'}
                onClick={() => { setIndex(i); setIsVideoSelected(false); }}
                alt={`Product image ${i + 1}`}
              />
            ))}

            {/* Map through the videos */}
            {product.video?.map((videoUrl, i) => (
              <div
                key={i}
                className={isVideoSelected && i === selectedVideoIndex ? 'small-image selected-image' : 'small-image'}
                onClick={(e) => { 
                  e.preventDefault();  // Prevent default behavior
                  setIsVideoSelected(true); 
                  setSelectedVideoIndex(i); 
                }}
              >
                <img
                  className={i === index && !isVideoSelected ? 'small-image selected-image' : 'small-image'}
                  src={urlFor(product.video[selectedVideoIndex].thumbnail)}
                  alt={product.name}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{product.name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>{translations[language].reviews}</p>
          </div>
          <h4>{translations[language].details}</h4>
          <p>{product.details}</p>
          <p className="price">₪ {product.price}</p>

          <div className="product-colors">
            {product.colors && product.colors.map((item, index) => (
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
                      color: 'red',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '1.5rem',
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
              item.quantity > 0 ? 
              <Product key={item._id} product={item} /> : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Replace getStaticPaths and getStaticProps with getServerSideProps
export const getServerSideProps = async ({ params }) => {
  const { slug } = params;
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const productData = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { productData, products },
  };
};

export default ProductDetails;
