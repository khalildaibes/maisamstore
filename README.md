Hey, this is a <b>Next.js</b> project of a <b>Fullstack Ecommerce Store</b> selling <b>Smart Gadgets</b>. <b>Sanity</b> is used as a backend <b>CMS</b> & integrated with <b>Stripe Payment Gateway</b> for making online transaction on the website. The site is hosted live @ <b>https://react-ecommerce-website-stripe.vercel.app/</b>


# Project Name 🚀

![GitHub repo size](https://img.shields.io/github/repo-size/khalildaibes/maisamstore)
![GitHub contributors](https://img.shields.io/github/contributors/khalildaibes/maisamstore)
![GitHub stars](https://img.shields.io/github/stars/khalildaibes/maisamstore?style=social)
![GitHub forks](https://img.shields.io/github/forks/khalildaibes/maisamstore?style=social)
![GitHub issues](https://img.shields.io/github/issues/khalildaibes/maisamstore)
![GitHub license](https://img.shields.io/github/license/khalildaibes/maisamstore)

## Overview 📋
Brief description of your project. Explain its purpose, features, and technologies used. A simple, concise introduction works best.

## Table of Contents 📑

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation 💻

### Prerequisites
<!-- Before installation, make sure you have the following installed:

- [Software 1](https://link-to-software)
- [Software 2](https://link-to-software) -->

### Steps to Install

```bash
# Clone the repository
git clone https://github.com/khalildaibes/maisamstore.git

# Navigate to the project directory
cd repo

# Install dependencies
npm install

# Run the project


to run this code install next js using the npm command 
npm install next

to run the the code use 
npm run dev 
```

## Usage 💻
# E-Commerce Website Documentation 📖

This documentation explains the usage, setup, and key features of our eCommerce website built with **Next.js**, integrated with **Sanity.io** for content management, and deployed using **Vercel** with a custom domain purchased via **HeapNames**.

---

## Table of Contents 📑
- [Website Overview](#website-overview)
- [User Guide](#user-guide)
  - [Browsing Products](#browsing-products)
  - [Product Search and Filters](#product-search-and-filters)
  - [Product Details](#product-details)
  - [Shopping Cart & Checkout](#shopping-cart--checkout)
- [Admin Guide](#admin-guide)
  - [Managing Products via Sanity.io](#managing-products-via-sanityio)
  - [Updating Website Content](#updating-website-content)
  - [Deploying Changes](#deploying-changes)
- [Domain Setup via HeapNames](#domain-setup-via-heapnames)
- [Common Issues](#common-issues)

---

## Website Overview 🛒

Our eCommerce website offers a dynamic shopping experience using **Next.js** for fast and scalable frontend rendering and **Sanity.io** as a headless CMS to manage products and other content. The site is hosted and deployed on **Vercel**, and the domain was purchased through **HeapNames** for a professional and personalized web presence.

---

## User Guide 📱

### Browsing Products

1. **Homepage Navigation**:
   - The homepage provides an overview of featured and best-selling products. Navigate through categories using the top navigation bar or category filters on the sidebar.

2. **Product Categories**:
   - Use the category buttons to filter products by type (e.g., Clothing, Electronics, Home Goods). The website supports real-time filtering thanks to Next.js's server-side rendering.

### Product Search and Filters 🔍

1. **Search Bar**:
   - Use the search bar at the top of the page to search for products by name, category, or keyword. The search is fast, with results dynamically loading as you type.

2. **Filter Options**:
   - Filter products by price range, brand, rating, or availability. The filters are accessible from the sidebar and update the product listings dynamically.

### Product Details 🛍

1. **Product Page**:
   - Click on any product to see its details, including high-resolution images, pricing, reviews, and availability.
   - View additional information such as product descriptions, size charts, or specifications based on the product category.

2. **Add to Cart**:
   - Select your desired quantity, size, or color (if applicable) and click "Add to Cart."

### Shopping Cart & Checkout 🛒

1. **Viewing Cart**:
   - After adding products, click on the cart icon in the upper-right corner to view your shopping cart. You can adjust quantities or remove items here.

2. **Checkout Process**:
   - Once ready, proceed to the checkout page, fill in your shipping details, and choose a payment method.
   - Review your order summary and click "Place Order" to complete the purchase.

---

## Admin Guide ⚙️

### Managing Products via Sanity.io

1. **Accessing Sanity Studio**:
   - To manage products, visit your Sanity Studio URL (e.g., `https://your-store.sanity.studio`). Log in with your admin credentials.

2. **Adding/Editing Products**:
   - Inside the "Products" section, you can create new products or edit existing ones. You can update:
     - **Title**: The product name.
     - **Images**: Upload or remove images for the product.
     - **Price**: Adjust pricing.
     - **Stock Availability**: Set whether the product is in stock or out of stock.
     - **Description**: Provide a detailed description of the product.
   
3. **Publishing Products**:
   - After editing or adding a new product, ensure you publish the changes by clicking the "Publish" button. Changes are reflected on the live website almost instantly.

### Updating Website Content

1. **Homepage and Static Content**:
   - Using Sanity, you can also update static content like homepage banners, promotional sections, and other marketing text. These sections can be found under the "Pages" or "Homepage" sections of your Sanity Studio.

### Deploying Changes

1. **Vercel Deployment**:
   - For codebase changes, push your changes to your GitHub repository. Vercel will automatically build and deploy the updated version of your website.
   - In case of manual deployment, log in to your Vercel dashboard, select your project, and trigger a new deployment from there.

---

## Domain Setup via HeapNames 🌐

1. **Domain Purchase**:
   - The custom domain (e.g., `www.yourstore.com`) was purchased via **HeapNames**. After purchasing, domain DNS settings were configured to point to Vercel’s servers.

2. **Linking Domain to Vercel**:
   - Log in to your **HeapNames** account and navigate to domain settings.
   - Update the **DNS records**:
     - **A Records**: Point the domain to the IP addresses provided by Vercel.
     - **CNAME Record**: Set up `www` to point to your Vercel project URL (e.g., `your-store.vercel.app`).
   - After the DNS settings propagate (usually takes a few minutes), the domain will be live.

---

## Common Issues ⚠️

1. **Product Not Displaying**:
   - Ensure the product is published in Sanity.io and check if there are any errors in the Vercel deployment logs.

2. **Domain Not Working**:
   - Double-check DNS settings in your HeapNames account and ensure they point to the correct Vercel project.
   - Use a tool like **DNS Checker** to verify DNS propagation.

3. **Slow Loading Pages**:
   - Clear cache or optimize images in Sanity.io to ensure faster loading times.
   - Use Next.js image optimization to improve performance.

---

For any further questions or issues, feel free to contact the support team at `support@yourstore.com`.

--- 

