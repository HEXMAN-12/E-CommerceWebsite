# E-Commerce Website

A modern e-commerce website built with vanilla JavaScript and Express.js, ready for deployment on Vercel.

## Features

- 🛍️ Browse products by category (Clothing and Accessories)
- 🔍 View detailed product information
- 🛒 Add items to cart
- 💳 Checkout functionality
- 📱 Responsive design
- 🚀 Fast loading with static file caching
- 🔒 Security headers and CORS protection

## Tech Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js, Express.js
- Deployment: Vercel
- Data Storage: JSON file (easily replaceable with a database)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd e-commerce-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser

### Production Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy your application

## Project Structure

```
├── api/
│   └── server.js          # Express server and API endpoints
├── css/
│   ├── cart.css          # Cart page styles
│   ├── content.css       # Product listing styles
│   └── header.css        # Header component styles
├── data/
│   └── products.json     # Product data
├── js/
│   └── jQuery3.4.1.js    # jQuery dependency
├── *.html                # HTML pages
├── package.json          # Project dependencies
└── vercel.json          # Vercel deployment configuration
```

## Customizing Products

Edit `data/products.json` to modify the product catalog. Each product should have:

```json
{
  "id": number,
  "name": string,
  "brand": string,
  "price": number,
  "description": string,
  "preview": string (URL),
  "photos": array of strings (URLs),
  "isAccessory": boolean
}
```

## Security Features

- CORS protection
- Security headers
- XSS protection
- Content type sniffing protection
- Clickjacking protection
- HTTPS enforcement

## Performance Optimizations

- Static file caching
- ETag support
- Gzipped responses
- Minified assets in production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 