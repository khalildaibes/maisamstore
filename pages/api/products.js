export default async function handler(req, res) {
  try {
    var url= 'server.yousef-style.shop' 
    
    const response = await fetch(`${url}/api/products`, {
      headers: {
        withCredentials: true, // Required for authentication
        "Content-Type": "application/json",
        Authorization: `Bearer 8e185963b4142a43003e224f0e93c359c71a9c07824f9ce25cdb703a41f91e8e354b280c4c6f420439c56a2c080cc8e60bfdddbb1c5146824519651f63bcf3af3ec0ea3a12f7f305f61c8d0e0291b5ab633be185c48ef7ebda624cf8245a3484872bf7a4e4b7790a5fafb50eb4b655a4ed49906da0383c3cfb3cb688cf47d671`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
