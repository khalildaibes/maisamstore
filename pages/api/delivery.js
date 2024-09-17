// pages/api/createOrder.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Extract data from the client request
      const { orderdetailes } = req.body; 
  
    // Now you can use orderdetailes in your code
    console.log(orderdetailes);

      // Prepare the data object to send to the external API
      const data =         {
        "jsonrpc": "2.0", 
                "params": { 
                "login":"0505831183", 
                "password": "123456789", 
                "db":"entregas",
                "customer_address":  orderdetailes.address,
                "customer_mobile": orderdetailes.phoneNumber,
                "customer_name": orderdetailes.name,
                "customer_area": orderdetailes.addressType ===  "ARAB_48" ?"צפון" : "ירושלים" ,
                "customer_sub_area": "",
                "reference_id":"",
                "cost":orderdetailes.subtotal,
                "no_of_items": orderdetailes.cart.length,
                "product_note": orderdetailes.notes + "הלקוח נמצא ב "+ orderdetailes.customer_area ===  "ARAB_48" ? " שטחי ישראל " : "שטחי הרשות הפלסטינית"
            }
        }
        console.log(data)

        
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
  