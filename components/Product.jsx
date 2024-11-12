import React from 'react'

import Link from 'next/link'; 
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { urlFor } from '../lib/client';
import { getImageUrl, fetchStrapiData } from '../lib/strapiClient'; // Adjust the path as necessary

const Product = ({ product: { image, name, slug, price} }) => {
  // const isStrapiClient = process.env.STRAPI_CLIENT === "true";
  const isStrapiClient = true;
  return (
    <div  className="product-card"> 
        <Link href={`/product/${slug}`}> 
        <div > 
        <img
      src={
        isStrapiClient
          ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${image[0].url}`
          : getImageUrl(image[0])
      }
      alt={name}
      className="product-image"
    />

        <p className="product-name">{name}</p>
          
        <p className="product-price">₪ {price}</p>
        <div className="reviews-product">
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
              </div>
        </div>
        </Link>
    </div>
  )
}

export default Product;