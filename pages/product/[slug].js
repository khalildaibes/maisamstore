import React, { useState, useEffect } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
  AiOutlineClose,
} from "react-icons/ai";
import { client as sanityClient, urlFor } from "../../lib/client";
import { Product } from "../../components";
import { useStateContext } from '../../context/StateContext'; 
import translations from '../../translations/translations';
import { useRouter } from 'next/router';
import { fetchStrapiData, getImageUrl } from '../../lib/strapiClient';

const ProductDetails = ({ productData, products }) => {
  const { image, name, details, price, colors, video } = productData;
  let { decQty, incQty, qty, onAdd, setShowCart, language } = useStateContext();
  const [product, setProduct] = useState(productData[0]); // State to hold product data
  const [index, setIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const router = useRouter();

  const isStrapiClient = process.env.STRAPI_CLIENT === 'true';

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

  // useEffect to poll the product data every few seconds
  useEffect(() => {
    // const interval = setInterval(async () => {
    //   const updatedProduct = await fetchProductData();
    //   setProduct(updatedProduct);
    // }, 5000);

    // return () => clearInterval(interval);
  }, []);
  console.log("productData is ", productData)

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            {/* {!isVideoSelected ? (
              <img
                src={isStrapiClient ? process.env.NEXT_PUBLIC_STRAPI_API_URL + product.image[0] : urlFor(product.image && product.image[index])}
                className="product-detail-image"
                alt={product.name}
              />
            ) : (
              <video className="product-detail-image" controls>
                <source src={isStrapiClient ? process.env.NEXT_PUBLIC_STRAPI_API_URL + product.video[selectedVideoIndex].url : urlFor(product.video[selectedVideoIndex])} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
            } */}
          </div>

          <div className="small-images-container">
            {product.image?.map((item, i) => (
              <img
                key={i}
                src={isStrapiClient ? `https://server.yousef-style.shop${item.url}` : getImageUrl(item)}
                className={i === index && !isVideoSelected ? 'small-image selected-image' : 'small-image'}
                onClick={() => { setIndex(i); setIsVideoSelected(false); }}
                alt={`Product image ${i + 1}`}
              />
            ))}

            {/* {product.video?.map((videoUrl, i) => (
              <div
                key={i}
                className={isVideoSelected && i === selectedVideoIndex ? 'small-image selected-image' : 'small-image'}
                onClick={() => { setIsVideoSelected(true); setSelectedVideoIndex(i); }}
              >
                <img
                  src={isStrapiClient ? process.env.NEXT_PUBLIC_STRAPI_API_URL + product.video[i].thumbnail.url : urlFor(product.video[i].thumbnail)}
                  alt={product.name}
                  className="small-image"
                />
              </div>
            ))} */}
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
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const { slug } = params;

  if (process.env.STRAPI_CLIENT === 'true') {
    try {
      const productData = await fetchStrapiData(`/products`, { filters: { slug: { $eq: slug } }, populate: '*' });
      const products = await fetchStrapiData(`/products`, { pagination: { pageSize: 100 }, populate: '*' });

      return {
        props: { productData: productData.data, products: products.data },
      };
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      return {
        props: { productData: null, products: [] },
      };
    }
  } else {
    const productQuery = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]';
    const productData = await sanityClient.fetch(productQuery);
    const products = await sanityClient.fetch(productsQuery);

    return {
      props: { productData, products },
    };
  }
};

export default ProductDetails;
