# Alpine Soap Co. - E-commerce Website

## Overview

Alpine Soap Co. is a handcrafted Swiss soap e-commerce website built with vanilla HTML, CSS, and JavaScript. The site showcases premium artisanal soaps with a focus on natural ingredients and traditional Swiss craftsmanship. The project emphasizes clean, semantic HTML structure, modern CSS practices, and progressive enhancement through JavaScript.

## System Architecture

### Frontend Architecture
- **Static Site Structure**: Multi-page application using traditional HTML pages
- **CSS Architecture**: Modular approach with separate files for skeleton loading and main styles
- **JavaScript Architecture**: Class-based modular design with separate concerns
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Progressive Enhancement**: Core functionality works without JavaScript

### Technology Stack
- **HTML5**: Semantic markup with proper accessibility features
- **CSS3**: Custom properties (CSS variables), modern layout techniques
- **Vanilla JavaScript**: ES6+ classes and modules
- **Local Storage**: Client-side data persistence for cart and user preferences
- **Google Fonts**: Typography enhancement (Crimson Text, Inter)

## Key Components

### 1. Page Structure
- **index.html**: Homepage with hero section, featured products, and newsletter signup
- **products.html**: Product catalog with filtering and sorting
- **product-detail.html**: Individual product pages with detailed information
- **cart.html**: Shopping cart and checkout process
- **contact.html**: Contact information and inquiry form

### 2. JavaScript Modules
- **main.js**: Core application logic, mobile menu, form validation
- **products.js**: Product management, filtering, catalog display
- **cart.js**: Shopping cart functionality, checkout process

### 3. CSS Organization
- **main.css**: Primary styles with CSS custom properties for theming
- **skeleton.css**: Loading state animations and placeholders

### 4. Design System
- **Color Palette**: Swiss wine country inspired (greens, browns, gold)
- **Typography**: Crimson Text for headings, Inter for body text
- **Spacing System**: Consistent spacing variables from --spacing-xs to --spacing-xxl
- **Component Library**: Reusable UI components with consistent styling

## Data Flow

### Product Management
1. Products are defined in JavaScript objects within products.js
2. Product data includes: ID, name, category, price, description, images, ingredients
3. Products are filtered and sorted based on user interactions
4. Product details are dynamically rendered on individual product pages

### Shopping Cart
1. Cart data is stored in localStorage for persistence
2. Items are added/removed through JavaScript events
3. Cart state is synchronized across all pages
4. Checkout process validates form data and processes orders

### User Interactions
1. Mobile menu toggle for responsive navigation
2. Product filtering and sorting on catalog pages
3. Form validation for contact and newsletter forms
4. Cart operations (add, remove, update quantities)

## External Dependencies

### Third-Party Services
- **Google Fonts**: Typography (Crimson Text, Inter)
- **Font Awesome**: Icons (cart, menu, social media)

### Planned Integrations
- **Payment Processing**: Stripe or PayPal integration for checkout
- **Email Service**: Newsletter signup and order confirmations
- **Analytics**: Google Analytics for user behavior tracking

## Deployment Strategy

### Current Setup
- **Static Hosting**: Designed for deployment to static hosting platforms
- **File Structure**: Organized for easy deployment (assets, CSS, JS folders)
- **Performance**: Optimized images, minified CSS/JS for production

### Recommended Platforms
- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Advanced features like form handling and redirects
- **Vercel**: Fast global CDN with automatic deployments

### Build Process
- **Asset Optimization**: Image compression and format conversion
- **Code Minification**: CSS and JavaScript minification
- **Bundle Management**: Potential integration with build tools (Webpack, Vite)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 06, 2025. Initial setup