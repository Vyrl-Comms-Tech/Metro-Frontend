Metro Jewellers
Project Overview
Develop a fully customized, modern jewellery catalogue website for Metro Jewellers, showcasing a wide range of jewellery, gemstones, and related collections. The website will provide customers with a premium, immersive browsing experience, allowing them to explore products and enquire directly through WhatsApp.

Project Scope & Key Features

1. Custom Website Development

Fully responsive website for desktop, tablet, and mobile.
Premium, immersive browsing experience with smooth animations and interactions.
Develop the website based on the provided design.

2. Website Color Theme & Visual Direction

Primary Color: White (#FFFFFF)
Secondary Color: Deep Forest Green (#00351D)
Maintain a clean, sophisticated, luxury-inspired aesthetic.
Use white as the dominant background color, complemented by deep green accents, buttons, navigation elements, and selected sections.
Keep the overall experience minimal and elegant, with strong emphasis on jewellery photography and product presentation.

3. Product Catalogue & Categories

Dedicated categories for jewellery, gemstones, and other collections.
Individual product detail pages with images, descriptions, and specifications.
Easy product navigation and category browsing.
No product prices displayed throughout the website.

4. WhatsApp Product Enquiries
   WhatsApp enquiry button on individual product pages.
   Pre-filled WhatsApp messages containing the selected product's details.
   No shopping cart or online checkout functionality.

5. Custom Admin Dashboard

Add, edit, and remove products.
Manage product images, descriptions, and categories.
Update website content and product collections.

6. Product Data Scraping

Develop a data scraping workflow to collect jewellery product information from identified external websites, subject to access permissions.
Organize and prepare the collected data for integration into the product catalogue.

7. Additional Website Sections

FAQ Section: Manage and display frequently asked questions.
Instagram Video Section: Showcase selected Instagram videos to highlight jewellery collections and brand content.

Project Objective
Build a premium digital jewellery catalogue that enhances Metro Jewellers' online presence, simplifies product discovery, and generates customer enquiries through WhatsApp.

---

## Project Checklist

✅ = built so far · ⬜ = not started

### 1. Custom Website Development

- ✅ Responsive layouts for desktop, tablet and mobile (mobile header uses a side drawer with dropdowns)
- ✅ Smooth animations: scroll-in category cards, accordion FAQs, reels carousel, drawer slide-in
- ⬜ Final pass against the provided design (pixel-level match)

### 2. Colour Theme & Visual Direction

- ✅ White primary and deep forest green (#00351D) secondary, set once as CSS variables in `index.css`
- ✅ Montserrat set once in `index.css`
- ✅ Clean, minimal layout with the focus on jewellery photography

### 3. Product Catalogue & Categories

- ✅ Collection pages for engagement rings, wedding rings, earrings, bracelets, necklaces, jewellery and sale items
- ✅ Filters (type, category, shape, metal, gemstone, width, carat), sorting and product counts
- ✅ Product detail page with image gallery, description, metal and diamond-type options, and details accordion
- ✅ Easy navigation: mega menu, mobile drawer, breadcrumbs, category cards on the home page
- ✅ Wishlist with a live count in the header and a dedicated page
- ✅ No prices shown anywhere
- ⬜ A dedicated Gemstones category
- ✅ A detail page for every product (`/product/:id`, loaded from the database)
- ✅ Real products only: no sample data, products are uploaded through the admin dashboard and stored in MongoDB

### 4. WhatsApp Product Enquiries

- ✅ "Enquire on WhatsApp" button on the product page
- ✅ Pre-filled message with the product name, diamond type, metal and page link
- ✅ Contact page whose form sends its details to WhatsApp
- ✅ No cart and no checkout

### 5. Custom Admin Dashboard
- ✅ Dashboard screens at `/admin`: overview, products, categories, website content, FAQs and Instagram reels
- ✅ Products, categories, FAQs, reels and website content: add, edit, remove and uploads all save to MongoDB and show on the public site
- ✅ Product forms include images, description and category; website content covers the home banner, contact details, hours and footer
- ⬜ Admin login
- ✅ Reels can use uploaded videos or video links, managed in the admin

### 6. Product Data Scraping

- ⬜ Scraping workflow for external jewellery sites (subject to permission)
- ⬜ Clean and prepare the scraped data for the catalogue

### 7. Additional Website Sections

- ✅ FAQ section on the home page and a full FAQ page grouped by category
- ✅ Instagram-style video (reels) carousel

### Also built (not in the brief)

- ✅ Contact Us page, header and footer, gold price chart (sample data)


---

1. gemstone

2.loose diamond
 - natural diamond
 - lab grown diamond

3.diamonds
 - natural diamond
 - lab grown diamond

4.jewellery 
- rings
- earrings
- necklaces
- bracelets
- exclusive pieces

<!-- 5.gold jewellery [on hold]
- rings
- earrings
- necklaces
- bracelets
- exclusive pieces -->

<!-- 6.Custom jewellery -->






<!-- Category Added is done on dashboard  -->
