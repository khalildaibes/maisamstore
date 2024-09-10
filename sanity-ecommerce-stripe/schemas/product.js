export default { 
  name: 'product', //Name of schema 
  title: 'Product', //Title of schema  
  type: 'document', //Type of schema
  fields: [ 
    { 
      // Product images
      name: 'image', 
      title: 'Image', 
      type: 'array', 
      of: [{ type: 'image' }], //Array 'of' images
      options: { 
        hotspot: true, //Enables image cropping
      }
    }, 
    { 
      // Product categories
      name: 'categories', 
      title: 'Categories', 
      type: 'array', 
      of: [{ type: 'string' }]
    }, 
    { 
      // Product quantity
      name: 'quantity', 
      title: 'Quantity', 
      type: 'number', 
    },
    { 
      // Product videos with thumbnails
      name: 'video', 
      title: 'Video', 
      type: 'array', 
      of: [
        {
          type: 'object',
          name: 'videoItem',
          title: 'Video Item',
          fields: [
            {
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: {
                hotspot: true // Video options
              }
            },
            {
              name: 'thumbnail',
              title: 'Thumbnail',
              type: 'image', // Thumbnail image
              options: {
                hotspot: true
              }
            }
          ]
        }
      ]
    },  
    { 
      // Product name
      name: 'name', 
      title: 'Name', 
      type: 'string', 
    }, 
    { 
      // Product slug (URL)
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { 
        source: 'name', 
        maxLength: 90, 
      }
    }, 
    { 
      // Product price
      name: 'price', 
      title: 'Price', 
      type: 'number', 
    }, 
    { 
      // Product description
      name: 'details', 
      title: 'Details', 
      type: 'string', 
    },
    {
      // Product colors
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'colorOption',
          title: 'Color Option',
          fields: [
            {
              name: 'name',
              title: 'Color Name',
              type: 'string'
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number'
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              }
            }
          ]
        }
      ],
      validation: Rule => Rule.optional(),
    }
  ]
}
