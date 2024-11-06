import axios from 'axios';

// Create a Strapi client instance
export const strapiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL || 'http://165.227.147.87:1337/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`, // Optional if using token-based auth
  },
});


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
