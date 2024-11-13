


const fs = require('fs');
const path = require('path');

// Function to create directories and files for the new content type
const createContentType = (contentTypeName, attributes) => {
  const apiPath = path.join(__dirname, 'src', 'api', contentTypeName);

  // Define directory structure for the content type
  const directories = [
    path.join(apiPath, 'controllers'),
    path.join(apiPath, 'services'),
    path.join(apiPath, 'routes'),
    path.join(apiPath, 'content-types'),
    path.join(apiPath, 'content-types', `${contentTypeName}`),
  ];

  // Create directories if they don't exist
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create the controller file
  const controllerContent = `'use strict';
  
/**
 * test controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::${contentTypeName.toLowerCase()}.${contentTypeName.toLowerCase()}');

  `;
  fs.writeFileSync(path.join(apiPath, 'controllers', `${contentTypeName}.js`), controllerContent);

  // Create the service file
  const serviceContent = `/**
 * test service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::${contentTypeName}.${contentTypeName}');
  `;
  fs.writeFileSync(path.join(apiPath, 'services', `${contentTypeName}.js`), serviceContent);

  // Create the route file
  const routeContent = `/**
 * test router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::${contentTypeName.toLowerCase()}.${contentTypeName.toLowerCase()}');

  `;
  fs.writeFileSync(path.join(apiPath, 'routes', `${contentTypeName}.js`), routeContent);

  // Create the model (content type definition)
  const modelContent = {
    kind: "collectionType",
    collectionName: `${contentTypeName}s`,
    info: {
      singularName: contentTypeName.toLowerCase(),
      pluralName: `${contentTypeName.toLowerCase()}s`,
      displayName: contentTypeName.charAt(0).toUpperCase() + contentTypeName.slice(1),
      description: `A collection for ${contentTypeName}`
    },
    options: {
      draftAndPublish: true,
    },
    attributes: attributes,
  };

  fs.writeFileSync(
    path.join(apiPath, 'content-types', `${contentTypeName}`,`schema.json`),
    JSON.stringify(modelContent, null, 2)
  );

  console.log(`Content Type '${contentTypeName}' created successfully!`);
};

// Define the attributes for the `orderDetails` content type
const orderDetailsAttributes = {
  status: {
    type: 'string',
  },
  cost: {
    type: 'float',
  },
  phoneNumber: {
    type: 'string',
  },
  name: {
    type: 'string',
    required: true,
  },
  addressType: {
    type: 'enumeration',
    enum: ['ARAB_48', 'West_Bank'],
    required: true,
  },
  address: {
    type: 'string',
    required: true,
  },
  street: {
    type: 'string',
    required: true,
  },
  city: {
    type: 'string',
    required: true,
  },
  paymentMethod: {
    type: 'enumeration',
    enum: ['Credit Card', 'Cash on Delivery'],
    required: true,
  },
  notes: {
    type: 'text',
  },
  subtotal: {
    type: 'float',
    required: true,
  },
  cart: {
    type: 'json', // Use JSON type to represent the nested array structure for `cart`
  },
};

// Call the function to create a new content type named 'orderDetails'
createContentType('orderdetails', orderDetailsAttributes);
