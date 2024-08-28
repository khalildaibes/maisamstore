// pages/api/sendWhatsAppMessage.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract necessary data from the request body
    const { clientPhoneNumber, clientName, address, notes, cartItems, token } = req.body;

    // WhatsApp API endpoint and headers
    const url = 'https://graph.facebook.com/v18.0/209317558942807/messages';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer EAANVrunrZADwBO7r4C0KoWsjkWp0nLIXqFIZCDYbHwFLtieaBgxUQWV3sJC0CZBupVZCG2t5gOFys2SoJfKc6fBrmAPpZCM6sGuBdXeRORYJk9a3VKYVZCRNaHMkKi3fNK7LFjSYW4mdg7Tvn9DVsWMnzv1NFZA1rZCZBysTZCJnQayUuFI9EFh7EQRXYfLpburii4BZCifRw2ibceclhfZA',
      Cookie: 'ps_l=0; ps_n=0'
    };

    // Prepare cart details as a string
    const cartDetails = cartItems.map(item => `product: ${item.name} quantity: ${item.quantity} color:${item.color}`).join(', ');

    // WhatsApp message payload using template
    const data = {
      messaging_product: 'whatsapp',
      to: `${clientPhoneNumber.substring(1)}`, // Remove the leading '+' character if present
      type: 'template',
      template: {
        name: 'your_template_name', // Replace with your actual template name
        language: {
          code: 'he', // Adjust language code as needed
          policy: 'deterministic'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: clientName
              },
              {
                type: 'text',
                text: clientPhoneNumber
              },
              {
                type: 'text',
                text: address
              },
              {
                type: 'text',
                text: notes
              },
              {
                type: 'text',
                text: cartDetails
              }
            ]
          }
        ]
      }
    };

    // Make the POST request to WhatsApp API
    const response = await axios.post(url, data, { headers });

    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ message: 'Failed to send WhatsApp message', error: error.message });
  }
}
