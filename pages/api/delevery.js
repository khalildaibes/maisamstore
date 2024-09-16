// pages/api/createOrder.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Extract data from the client request
      const {
        customer_address,
        customer_mobile,
        customer_name,
        customer_area,
        reference_id,
        cost
      } = req.body;
  
      // Prepare the data object to send to the external API
      const data = {
        "jsonrpc": "2.0",
        "params": {
          "login": "olivery_bs",
          "password": "12345678",
          "db": "entregas",
          "customer_address": customer_address,
          "customer_mobile": customer_mobile,
          "customer_name": customer_name,
          "customer_area": customer_area,
          "reference_id": reference_id,
          "cost": cost
        }
      };
  
      try {
        // Make the POST request to the external API
        const response = await fetch('https://entregas.olivery.io/create_order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
  
        // Forward the response from the external API
        if (response.ok) {
          res.status(200).json(result);
        } else {
          res.status(response.status).json(result);
        }
      } catch (error) {
        res.status(500).json({ message: 'Error occurred while creating the order', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  