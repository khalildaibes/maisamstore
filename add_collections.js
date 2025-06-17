const fs = require('fs');
const path = require('path');

// Function to create a component
const createComponent = (componentName, category, attributes) => {
  const componentsPath = path.join(__dirname, 'src', 'components', category);

  // Create components directory if it doesn't exist
  if (!fs.existsSync(componentsPath)) {
    fs.mkdirSync(componentsPath, { recursive: true });
  }

  // Create the schema for the component
  const schemaContent = {
    collectionName: `components_${category}_${componentName.toLowerCase()}s`,
    info: {
      displayName: componentName,
      icon: 'layout',
      description: '',
    },
    options: {
      draftAndPublish: false,
    },
    attributes: attributes,
  };

  fs.writeFileSync(
    path.join(componentsPath, `${componentName.toLowerCase()}.json`),
    JSON.stringify(schemaContent, null, 2)
  );

  console.log(`Component '${componentName}' created successfully in category '${category}'!`);
};

// Function to create directories and files for the new content type
const createContentType = (contentTypeName, attributes) => {
  const apiPath = path.join(__dirname, 'src', 'api', contentTypeName);

  // Define directory structure for the content type
  const directories = [
    path.join(apiPath, 'controllers'),
    path.join(apiPath, 'services'),
    path.join(apiPath, 'routes'),
    path.join(apiPath, 'content-types', contentTypeName),
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
 * ${contentTypeName} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${contentTypeName}.${contentTypeName}');
`;
  fs.writeFileSync(path.join(apiPath, 'controllers', `${contentTypeName}.js`), controllerContent);

  // Create the service file
  const serviceContent = `'use strict';

/**
 * ${contentTypeName} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${contentTypeName}.${contentTypeName}');
`;
  fs.writeFileSync(path.join(apiPath, 'services', `${contentTypeName}.js`), serviceContent);

  // Create the route file
  const routeContent = `'use strict';

/**
 * ${contentTypeName} router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${contentTypeName}.${contentTypeName}');
`;
  fs.writeFileSync(path.join(apiPath, 'routes', `${contentTypeName}.js`), routeContent);

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
    pluginOptions: {},
    attributes: attributes,
  };

  fs.writeFileSync(
    path.join(apiPath, 'content-types', contentTypeName, 'schema.json'),
    JSON.stringify(schemaContent, null, 2)
  );

  console.log(`Content Type '${contentTypeName}' created successfully!`);
};

// Define components
const seoAttributes = {
  metaTitle: {
    type: 'string',
  },
  metaDescription: {
    type: 'text',
  },
  shareImage: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
};

const commentAttributes = {
  body: {
    type: 'text',
  },
  date: {
    type: 'datetime',
  },
  admin_user: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'admin::user',
  },
  likes: {
    type: 'integer',
  },
};

const vedioLinksAttributes = {
  url: {
    type: 'string',
  },
  description: {
    type: 'text',
  },
  title: {
    type: 'string',
  },
};

const sliderAttributes = {
  files: {
    type: 'media',
    multiple: true,
    allowedTypes: ['images'],
  },
};

const richTextAttributes = {
  body: {
    type: 'richtext',
  },
};

// Define the Global type attributes
const globalAttributes = {
  siteName: {
    type: 'string',
  },
  defaultSeo: {
    type: 'component',
    component: 'shared.seo',
  },
  favicon: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
};

// Create components first
createComponent('Seo', 'shared', seoAttributes);
createComponent('Comment', 'shared', commentAttributes);
createComponent('VedioLinks', 'links', vedioLinksAttributes);
createComponent('Slider', 'media', sliderAttributes);
createComponent('RichText', 'shared', richTextAttributes);


// Define attributes for Article
const articleAttributes = {
  title: {
    type: 'string',
  },
  description: {
    type: 'text',
  },
  slug: {
    type: 'uid',
    targetField: 'title',
  },
  cover: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
  author: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'api::author.author',
  },
  categories: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::category.category',
  },
  blocks: {
    type: 'dynamiczone',
    components: ['media.slider', 'shared.rich-text'],
  },
  content: {
    type: 'richtext',
  },
  conver: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
  vedioLinks: {
    type: 'component',
    repeatable: true,
    component: 'links.vediolinks',
  },
  comments: {
    type: 'component',
    repeatable: true,
    component: 'shared.comment',
  },
};

// Define attributes for Author
const authorAttributes = {
  name: {
    type: 'string',
  },
  avatar: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
  email: {
    type: 'string',
  },
  articles: {
    type: 'relation',
    relation: 'oneToMany',
    target: 'api::article.article',
  },
};

// Define attributes for Category
const categoryAttributes = {
  name: {
    type: 'string',
  },
  slug: {
    type: 'uid',
    targetField: 'name',
  },
  description: {
    type: 'text',
  },
  articles: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::article.article',
  },
};

// Define attributes for Parts - renamed to AutoPart for better API naming
const PartAttributes = {
  slug: {
    type: 'uid',
    targetField: 'title',
  },
  title: {
    type: 'string',
  },
  description: {
    type: 'text',
  },
  date: {
    type: 'datetime',
  },
  images: {
    type: 'media',
    multiple: true,
    allowedTypes: ['images'],
  },
  stores: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::store.store',
  },
  available: {
    type: 'boolean',
  },
  details: {
    type: 'json',
  },
  price: {
    type: 'decimal',
  },
  categories: {
    type: 'string',
  },
  clicks: {
    type: 'integer',
    default: 0,
  },
  visits: {
    type: 'integer',
    default: 0,
  },
  shares: {
    type: 'integer',
    default: 0,
  },
  publisher: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'plugin::users-permissions.user',
  },
};

// Define attributes for Product
const productAttributes = {
  image: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
  categories: {
    type: 'string',
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
    type: 'decimal',
  },
  details: {
    type: 'json',
  },
  store: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'api::store.store',
  },
  services: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::service.service',
  },
  clicks: {
    type: 'integer',
    default: 0,
  },
  visits: {
    type: 'integer',
    default: 0,
  },
  shares: {
    type: 'integer',
    default: 0,
  },
  publisher: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'plugin::users-permissions.user',
  },
};

// Define attributes for Service (singular)
const serviceAttributes = {
  title: {
    type: 'string',
  },
  description: {
    type: 'text',
  },
  price: {
    type: 'decimal',
  },
  stores: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::store.store',
  },
  image: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
  date: {
    type: 'datetime',
  },
  details: {
    type: 'json',
  },
  slug: {
    type: 'uid',
    targetField: 'title',
  },
  products: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::product.product',
  },
  clicks: {
    type: 'integer',
    default: 0,
  },
  visits: {
    type: 'integer',
    default: 0,
  },
  shares: {
    type: 'integer',
    default: 0,
  },
  publisher: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'plugin::users-permissions.user',
  },
};

// Define attributes for OrderDetails
const orderDetailsAttributes = {
  order_id: {
    type: 'string',
  },
  status: {
    type: 'string',
  },
  total: {
    type: 'decimal',
  },
  date: {
    type: 'datetime',
  },
  store: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'api::store.store',
  },
  details: {
    type: 'json',
  },
};

// Update Store attributes to reference part instead of carparts
const storeAttributes = {
  name: {
    type: 'string',
  },
  phone: {
    type: 'string',
  },
  address: {
    type: 'string',
  },
  details: {
    type: 'richtext',
  },
  hostname: {
    type: 'string',
  },
  visits: {
    type: 'integer',
    default: 0,
  },
  clicks: {
    type: 'integer',
    default: 0,
  },
  shares: {
    type: 'integer',
    default: 0,
  },
  publisher: {
    type: 'relation',
    relation: 'manyToOne',
    target: 'plugin::users-permissions.user',
  },
  tags: {
    type: 'string',
  },
  provider: {
    type: 'string',
  },
  slug: {
    type: 'uid',
    targetField: 'name',
  },
  products: {
    type: 'relation',
    relation: 'oneToMany',
    target: 'api::product.product',
  },
  logo: {
    type: 'media',
    multiple: false,
    allowedTypes: ['images'],
  },
  socialMedia: {
    type: 'json',
  },
  parts: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::part.part',
  },
  services: {
    type: 'relation',
    relation: 'manyToMany',
    target: 'api::service.service',
  },
  apiToken: {
    type: 'string',
  },
}; 

// Then create content types
createContentType('global', globalAttributes);
createContentType('article', articleAttributes);
createContentType('author', authorAttributes);
createContentType('category', categoryAttributes);
createContentType('part', PartAttributes);
createContentType('product', productAttributes);
createContentType('service', serviceAttributes);
createContentType('store', storeAttributes);
createContentType('orderdetails', orderDetailsAttributes);
