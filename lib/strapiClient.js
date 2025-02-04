import axios from 'axios';
import { urlFor } from '../lib/client'; // Import urlFor if using Sanity
var url= 'server.yousef-style.shop' 
var token = "JWT_TOKEN_HOLDER"
// Create a Strapi client instance
export const strapiClient = axios.create({
  baseURL: `http://${url}:1337/api`,
  headers: {
    "Content-Type": "application/json",
    host:url, 
    Authorization: `Bearer 8e185963b4142a43003e224f0e93c359c71a9c07824f9ce25cdb703a41f91e8e354b280c4c6f420439c56a2c080cc8e60bfdddbb1c5146824519651f63bcf3af3ec0ea3a12f7f305f61c8d0e0291b5ab633be185c48ef7ebda624cf8245a3484872bf7a4e4b7790a5fafb50eb4b655a4ed49906da0383c3cfb3cb688cf47d671`, // Optional if using token-based auth
  },
});

// Utility function to get the image URL from Strapi or Sanity
export const getImageUrl = (image) => {
  if (image.url) {
    // For Strapi images
    return process.env.NEXT_PUBLIC_STRAPI_API_URL + image.url;
  } else if (image.asset) {
    // For Sanity images
    return urlFor(image).url();
  }
  return ''; // Return an empty string if no valid image is found
};

export const addStrapiData = async (data) => {
  try {
    console.error("data:", data);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding order via API Proxy:", error);
    throw error;
  }
};

// Helper function to fetch data using the Strapi client
export const fetchStrapiData = async (endpoint, params = {}) => {
  try {
    const response = await strapiClient.get(endpoint, {
      params,
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error(`Error fetching data from Strapi: ${error}`);
    throw error;
  }
};
