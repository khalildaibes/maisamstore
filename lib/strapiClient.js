import axios from 'axios';
import { urlFor } from '../lib/client'; // Import urlFor if using Sanity
var url= '209.38.231.156' 
// Create a Strapi client instance
export const strapiClient = axios.create({
  baseURL: `http://${url}:1337/api`,
  headers: {
    Authorization: `Bearer 7ef7947edd7ce61cacef51ecc5a9ba0e7af6701c9fe537a67da3aa8cbc701c4ede56fc4690a1948bdad5554d788636ef5c444c05773a2b773d9f82b9dce2c0bfe44a0bdd4c22d99a025af6fda17c48cede68be59ef0559520098a0c2a962fcdb8950cdc3911d4b5c82c71d8775d69327a96a74c62e149a66520d4d37627f0bab`, // Optional if using token-based auth
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

// Helper function to add data to Strapi
export const addStrapiData = async (endpoint, data) => {
  try {
    const response = await strapiClient.post(endpoint, { data });
    return response.data; // Return the response data from Strapi
  } catch (error) {
    console.error(`Error adding data to Strapi: ${error}`);
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
