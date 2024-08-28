import React from 'react'

import Link from 'next/link'; 
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { urlFor } from '../lib/client';

const Product = ({ product: { image, name, slug, price} }) => {
  return (
    <div  className="product-card"> 
        <Link href={`/product/${slug.current}`}> 
        <div > 
        <img
        src={urlFor(image && image[0])}
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