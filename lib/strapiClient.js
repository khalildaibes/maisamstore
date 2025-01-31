import axios from 'axios';
import { urlFor } from '../lib/client'; // Import urlFor if using Sanity

// Create a Strapi client instance
export const strapiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api`,
  headers: {
    Authorization: `Bearer 815268e848017b4954bf9b66280241a56d68fff77f8fdafe8031f257dc166e919fbc1e0752719d38de33cda4d10fd2a015a3a000fb4b78ff89161007138a620749ef168233a733dcc489d9c394c8e41fa4ac3b60c8d3555118eddc8f797a06c9608b72e0e19b3feb3fbde5becaa15684c689553f018a37a26edd0b18d627c258`, // Optional if using token-based auth
  },
});
// 2c2c0749b17e5a202e81d58cf1d409bd5f7a65f51a320b4e27cd75d01c0868ea98efab36fd856b5a9a12efb662f7ebbedc28afb5c30067b2e6c629b67c62e56b
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
