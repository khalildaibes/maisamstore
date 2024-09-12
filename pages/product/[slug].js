import React, { useState } from "react";
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
function videoAssetFor(source) {
  return getFileAsset(source, client.config());
}
const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, colors, video } = product;  // Add videos here
  const { decQty, incQty, qty, onAdd, setShowCart, language } = useStateContext();
  const [index, setIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);  // State to toggle between video and image
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);  // Index to track the selected video
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    if (color.quantity > 0) {
      setSelectedColor(color);
    }
  };

  const handleAddToCart = () => {
    if (product.quantity  > 0 ){
      if (product.quantity  < qty ){
        alert("NO ENOUGH OF THIS PRODUCT IN STORE");
        return;
      }
    if (colors && colors.length > 0 && !selectedColor) {
      alert(translations[language].selectColorAlert);
      return;
    }
    onAdd(product, qty, selectedColor);
  }
  else{
    alert("SOLD OUT!!!");
    return;
  }
  };

  const handleBuyNow = () => {
    if (product.quantity  > 0 ){
      if (product.quantity  < qty ){
        alert("NO ENOUGH OF THIS PRODUCT IN STORE");
        return;
      }
    if (colors && colors.length > 0 && !selectedColor) {
      alert(translations[language].selectColorAlert);
      return;
    }
    onAdd(product, qty, selectedColor);
    setShowCart(true);
  }
  else{
    alert("SOLD OUT!!!");
    return;
  }
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            {/* Conditional rendering to either show the image or the video */}
            {!isVideoSelected ? (
              <img
                src={urlFor(image && image[index])}
                className="product-detail-image"
                alt={name}
              />
            ) : (
              <video className="product-detail-image" controls>
                <source src={getUrlFromId(video[selectedVideoIndex].videoFile)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="small-images-container">
            {/* Map through the images */}
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={i === index && !isVideoSelected ? 'small-image selected-image' : 'small-image'}
                onClick={() => { setIndex(i); setIsVideoSelected(false); }}
                alt={`Product image ${i + 1}`}
              />
            ))}

            {/* Map through the videos */}
            {video?.map((videoUrl, i) => (
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

                src={urlFor(video[selectedVideoIndex].thumbnail)}
                alt={name}
              />
              </div>
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
              product.quantity  > 0? 
              <Product key={product._id} product={product} />: null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
