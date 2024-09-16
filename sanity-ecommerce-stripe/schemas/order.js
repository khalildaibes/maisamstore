export default {
  name: 'orderDetails',
  title: 'Order Details',
  type: 'document',
  fields: [
    {
      name: 'status',
      title: 'Status',
      type: 'string',
    },
    {
      name: 'cost',
      title: 'Cost',
      type: 'number',
    },

    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100),
    },
    {
      name: 'addressType',
      title: 'Address Type',
      type: 'string',
      options: {
        list: [
          { title: 'Inside Israel', value: "ARAB_48" },
          { title: 'West Bank', value:"West_Bank" },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200),
    },
    {
      name: 'street',
      title: 'Street',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100),
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100),
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Card', value: 'Credit Card' },
          { title: 'Cash on Delivery', value: 'Cash on Delivery' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
      validation: Rule => Rule.max(500),
    },
    {
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'cart',
      title: 'Cart',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'cartItem',
          title: 'Cart Item',
          fields: [
            {
              name: 'productName',
              title: 'Product Name',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: Rule => Rule.required().min(1),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
          ],
        },
      ],
    },
  ],
};
