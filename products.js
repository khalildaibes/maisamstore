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
    path.join(apiPath, 'config'),
    path.join(apiPath, 'models'), // for settings.json
    path.join(apiPath, 'content-types', `${contentTypeName}`),
  ];

  // Create directories if they don't exist
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create the controller file
  const controllerContent = `
/**
 * ${contentTypeName} controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::${contentTypeName}.${contentTypeName}');
`;
  fs.writeFileSync(path.join(apiPath, 'controllers', `${contentTypeName}.ts`), controllerContent);

  // Create the service file
  const serviceContent = `
/**
 * ${contentTypeName} service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::${contentTypeName}.${contentTypeName}');
`;
  fs.writeFileSync(path.join(apiPath, 'services', `${contentTypeName}.ts`), serviceContent);

  // Create the router file
  const routeContent = `
/**
 * ${contentTypeName} router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::${contentTypeName}.${contentTypeName}');
`;
  fs.writeFileSync(path.join(apiPath, 'routes', `${contentTypeName}.ts`), routeContent);

  // Create the schema (content type definition)
  const schemaContent = {
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
    path.join(apiPath, 'content-types', `${contentTypeName}`, `schema.json`),
    JSON.stringify(schemaContent, null, 2)
  );

  // Create the model settings definition
  const modelContent = {
    collectionName: `${contentTypeName}`,
    info: {
      name: `${contentTypeName}`,
      description: ""
    },
    options: {
      draftAndPublish: false,
      increments: true,
      timestamps: true,
      comment: ""
    },
    attributes: attributes,
  };
  fs.writeFileSync(
    path.join(apiPath, 'models', `${contentTypeName}.settings.json`),
    JSON.stringify(modelContent, null, 2)
  );

  // Create the routes configuration
  const routesConfig = {
    routes: [
      {
        method: "GET",
        path: `/${contentTypeName.toLowerCase()}s`,
        handler: `${contentTypeName}.find`,
        config: { policies: [] }
      },
      {
        method: "GET",
        path: `/${contentTypeName.toLowerCase()}s/count`,
        handler: `${contentTypeName}.count`,
        config: { policies: [] }
      },
      {
        method: "GET",
        path: `/${contentTypeName.toLowerCase()}s/:id`,
        handler: `${contentTypeName}.findOne`,
        config: { policies: [] }
      },
      {
        method: "POST",
        path: `/${contentTypeName.toLowerCase()}s`,
        handler: `${contentTypeName}.create`,
        config: { policies: [] }
      },
      {
        method: "PUT",
        path: `/${contentTypeName.toLowerCase()}s/:id`,
        handler: `${contentTypeName}.update`,
        config: { policies: [] }
      },
      {
        method: "DELETE",
        path: `/${contentTypeName.toLowerCase()}s/:id`,
        handler: `${contentTypeName}.delete`,
        config: { policies: [] }
      }
    ]
  };

  fs.writeFileSync(
    path.join(apiPath, 'config', `routes.json`),
    JSON.stringify(routesConfig, null, 2)
  );

  console.log(`Content Type '${contentTypeName}' created successfully!`);
};

// Define the attributes for the `product` content type to match the CSV order and table structure
const productAttributes = {
  categories: {
    type: 'string', // JSON type for array of strings
  },
  quantity: {
    type: 'integer',
  },
  name: {
    type: 'string',
  },
  slug: {
    type: 'uid',
    targetField: 'name',
  },
  price: {
    type: 'float',
  },
  details: {
    type: 'text',
  },
  colors: {
    type: 'json', // JSON type for color options
  }
};

// Call the function to create a new content type named 'product'
createContentType('product', productAttributes);
