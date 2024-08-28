export default { 
    name: 'product', //Name of schema 
    title: 'Product', //Title of schema  
    type: 'document', //Type of schema
    //Fields required in this particular schema
    fields: [ //Array of objects 
        { 
            //Image of the product 
            name: 'image', 
            title: 'Image', 
            type: 'array', 
            of: [{type: 'image'}], //Array 'of' images
            options: { 
                hotspot: true, //Hotspot is a property for enabling user images to be placed in a better format
            }
        }, 
        { 
            //Image of the product 
            name: 'categories', 
            title: 'Categories', 
            type: 'array', 
            of: [{type: 'string'}], //Array 'of' images
            options: { 
                hotspot: true, 
            }
        }, 
        { 
            //Name of the product
            name: 'quantity', 
            title: 'Quantity', 
            type: 'int', 
        }, 
        { 
            //Name of the product
            name: 'name', 
            title: 'Name', 
            type: 'string', 
        }, 
        
       
        { 
            //Slug/URL for the product
            name: 'slug', 
            title: 'Slug', 
            type: 'slug', //type = url
            options: { 
                source: 'name', 
                maxLength: 90, 
            }
        }, 
        { 
            //Price of the product
            name: 'price', 
            title: 'Price', 
            type: 'number', 
        }, 
        { 
            //Products details/ description
            name: 'details', 
            title: 'Details', 
            type: 'string', 
        },
        {
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
                    type: 'int'
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
            validation: Rule => Rule.optional(), // Makes the field optional
          }
    ]
}