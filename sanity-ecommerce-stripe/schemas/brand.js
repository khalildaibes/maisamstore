export default { 
    name: 'brand', //Name of schema 
    title: 'Brand', //Title of schema  
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
            //Name of the product
            name: 'name', 
            title: 'Name', 
            type: 'string', 
        }, 
        

        { 
            //Products details/ description
            name: 'details', 
            title: 'Details', 
            type: 'string', 
        },

    ]
}