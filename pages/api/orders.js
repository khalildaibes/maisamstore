export default async function handler(req, res) {
  const { method, body } = req;
  const apiUrl = `https://server.yousef-style.shop/api/Orderdetailss`;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const controller = new AbortController(); // Create a timeout controller
    const timeout = setTimeout(() => controller.abort(), 10000); // Set 10s timeout

    // Make a request to Strapi with the order data
    const response = await fetch(apiUrl, {
      method: "POST",
      signal: controller.signal, // Attach timeout signal
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 8e185963b4142a43003e224f0e93c359c71a9c07824f9ce25cdb703a41f91e8e354b280c4c6f420439c56a2c080cc8e60bfdddbb1c5146824519651f63bcf3af3ec0ea3a12f7f305f61c8d0e0291b5ab633be185c48ef7ebda624cf8245a3484872bf7a4e4b7790a5fafb50eb4b655a4ed49906da0383c3cfb3cb688cf47d671`, // Use environment variable for security
      },
      body: JSON.stringify({ data: body }), // Strapi expects { data: { orderData } }
    });

    clearTimeout(timeout); // Clear timeout after success

    if (!response.ok) {
      throw new Error(`Failed to add order: ${response.statusText}`);
    }

    const responseData = await response.json();
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("API Proxy Error (Orders):", error);
    if (error.name === "AbortError") {
      return res.status(504).json({ message: "Request timed out" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
