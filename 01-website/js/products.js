// Products management for Alpine Soap Co.
// Handles product display, filtering, and product data

class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = '';
        this.currentSort = 'featured';
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupFilters();
        this.setupProductGrid();
        this.setupProductDetails();
        this.handleCategoryFromUrl();
    }

    // Product data - In a real app, this would come from an API
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: 'Lavender Dreams',
                category: 'lavender',
                price: 12.50,
                description: 'Handcrafted lavender soap with organic Swiss lavender oil. Perfect for relaxation and calming your senses.',
                image: 'https://www.bentonshirefarms.com/cdn/shop/files/LAVDSoap2-PhotoRoom.png?v=1707331327&width=1445',
                featured: true,
                ingredients: ['Olive oil', 'Coconut oil', 'Lavender essential oil', 'Dried lavender buds'],
                weight: '100g',
                inStock: true
            },
            {
                id: 2,
                name: 'Citrus Sunrise',
                category: 'citrus',
                price: 11.00,
                description: 'Energizing citrus blend with orange, lemon, and grapefruit oils. Start your day with a burst of freshness.',
                image: 'https://www.buttertreesoap.com/cdn/shop/files/FullSizeRender_c749d2fe-676f-443b-ab22-5657f37fd9a3.heic?v=1697840215&width=1946',
                featured: true,
                ingredients: ['Palm oil', 'Coconut oil', 'Orange essential oil', 'Lemon essential oil'],
                weight: '100g',
                inStock: true
            },
            {
                id: 3,
                name: 'Alpine Herbs',
                category: 'herbs',
                price: 13.50,
                description: 'Traditional herbal soap with mountain herbs collected from the Swiss Alps. Rich in natural minerals.',
                image: 'https://fyneherbs.co.uk/cdn/shop/files/SOAPp4SS2354721613.png?v=1724162274',
                featured: false,
                ingredients: ['Olive oil', 'Herbs blend', 'Mountain spring water', 'Natural minerals'],
                weight: '120g',
                inStock: true
            },
            {
                id: 4,
                name: 'Wine Country Luxe',
                category: 'wine',
                price: 15.00,
                description: 'Premium soap infused with red wine extract and grape seed oil. Antioxidant-rich for healthy skin.',
                image: 'https://goimagine.com/images/detailed/4261/IMG_0645_1735495712167_jpeg_9748081236_1735495718_org.jpeg',
                featured: true,
                ingredients: ['Red wine extract', 'Grape seed oil', 'Shea butter', 'Vitamin E'],
                weight: '110g',
                inStock: true
            },
            {
                id: 5,
                name: 'Chamomile Gentle',
                category: 'herbs',
                price: 10.50,
                description: 'Ultra-gentle soap with chamomile extract. Perfect for sensitive skin and children.',
                image: 'https://www.trevarnoskincare.co.uk/wp-content/uploads/2011/03/Camomile-3-scaled.jpeg',
                featured: false,
                ingredients: ['Chamomile extract', 'Coconut oil', 'Oat milk', 'Honey'],
                weight: '100g',
                inStock: true
            },
            {
                id: 6,
                name: 'Lemon Verbena',
                category: 'citrus',
                price: 11.50,
                description: 'Fresh lemon verbena soap with a crisp, clean scent. Naturally antibacterial and refreshing.',
                image: 'https://www.soaplicity.com/cdn/shop/products/LemonVerbena.jpg?v=1686268040',
                featured: false,
                ingredients: ['Lemon verbena oil', 'Coconut oil', 'Olive oil', 'Sea salt'],
                weight: '100g',
                inStock: false
            },
            {
                id: 7,
                name: 'Rosemary Mint',
                category: 'herbs',
                price: 12.00,
                description: 'Invigorating rosemary and mint soap. Stimulates circulation and provides a refreshing cleanse.',
                image: 'https://sweetharvestfarms.com/cdn/shop/products/750_8126rosemary.jpg?v=1532908901&width=1024',
                featured: false,
                ingredients: ['Rosemary essential oil', 'Peppermint oil', 'Olive oil', 'Activated charcoal'],
                weight: '100g',
                inStock: true
            },
            {
                id: 8,
                name: 'Lavender Honey',
                category: 'lavender',
                price: 14.00,
                description: 'Luxurious lavender soap with Swiss mountain honey. Moisturizing and soothing for all skin types.',
                image: 'https://mionartisansoap.com/cdn/shop/products/VIC_6356copy3.jpg?v=1676328151',
                featured: false,
                ingredients: ['Lavender oil', 'Swiss honey', 'Shea butter', 'Beeswax'],
                weight: '110g',
                inStock: true
            },
            {
                id: 9,
                name: 'Grape Seed Exfoliant',
                category: 'wine',
                price: 13.00,
                description: 'Gentle exfoliating soap with crushed grape seeds. Removes dead skin cells for a smooth finish.',
                image: 'https://i.etsystatic.com/16822087/r/il/770b28/1810606591/il_fullxfull.1810606591_m1j6.jpg',
                featured: false,
                ingredients: ['Grape seed oil', 'Crushed grape seeds', 'Olive oil', 'Vitamin C'],
                weight: '120g',
                inStock: true
            },
            {
                id: 10,
                name: 'Orange Bergamot',
                category: 'citrus',
                price: 12.50,
                description: 'Sophisticated citrus blend with sweet orange and earl grey bergamot. A unique aromatic experience.',
                image: 'https://www.inkyquillsllc.com/cdn/shop/products/Orange_B_Word_Gold_800s.jpg?v=1412956387',
                featured: false,
                ingredients: ['Orange oil', 'Bergamot oil', 'Earl grey tea', 'Coconut oil'],
                weight: '100g',
                inStock: true
            }
        ];

        this.filteredProducts = [...this.products];
    }

    setupFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.filterProducts();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
            });
        }
    }

    setupProductGrid() {
        // Load products on relevant pages
        if (window.location.pathname.includes('products.html')) {
            this.renderProductGrid();
        } else if (
            window.location.pathname.includes('homepage.html') ||
            window.location.pathname === '/' ||
            window.location.pathname.includes('homepage.html') // 👈 add this line
        ) {
            this.renderFeaturedProducts();
        }
    }


    setupProductDetails() {
        if (window.location.pathname.includes('product-detail.html')) {
            this.renderProductDetail();
        }
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            if (this.currentCategory && product.category !== this.currentCategory) {
                return false;
            }
            return true;
        });

        this.sortProducts();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
                });
                break;
        }

        this.renderProductGrid();
    }

    renderProductGrid() {
        const productsGrid = document.getElementById('products-grid');
        const noProducts = document.getElementById('no-products');

        if (!productsGrid) return;

        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = '';
            if (noProducts) noProducts.style.display = 'block';
            return;
        }

        if (noProducts) noProducts.style.display = 'none';

        productsGrid.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');
        this.setupProductCardEvents();
    }

    renderFeaturedProducts() {
        const featuredProductsGrid = document.getElementById('featured-products');
        
        if (!featuredProductsGrid) return;

        const featuredProducts = this.products.filter(product => product.featured).slice(0, 3);
        featuredProductsGrid.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
        this.setupProductCardEvents();
    }

    createProductCard(product) {
        const stockStatus = product.inStock ? '' : '<span class="out-of-stock">Out of Stock</span>';
        const addToCartDisabled = product.inStock ? '' : 'disabled';
        const priceFormatted = window.alpineSoapApp ? window.alpineSoapApp.formatCurrency(product.price) : `CHF ${product.price.toFixed(2)}`;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" onclick="window.productManager.viewProduct(${product.id})">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-category">${this.getCategoryDisplayName(product.category)}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${priceFormatted}</div>
                    ${stockStatus}
                    <div class="product-actions">
                        <button class="add-to-cart" data-product-id="${product.id}" ${addToCartDisabled}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupProductCardEvents() {
        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            });
        });

        // Wishlist buttons
        const wishlistButtons = document.querySelectorAll('.wishlist-button');
        wishlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.toggleWishlist(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        if (window.alpineSoapApp) {
            window.alpineSoapApp.updateCartCount();
        }

        // Show feedback
        this.showAddToCartFeedback(product.name);
    }

    toggleWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const existingIndex = wishlist.findIndex(item => item.id === productId);

        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            this.showWishlistFeedback(product.name, 'removed');
        } else {
            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                addedAt: new Date().toISOString()
            });
            this.showWishlistFeedback(product.name, 'added');
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.updateWishlistButtons();
    }

    showAddToCartFeedback(productName) {
        const feedback = document.createElement('div');
        feedback.className = 'cart-feedback';
        feedback.textContent = `${productName} added to cart!`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-green);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    showWishlistFeedback(productName, action) {
        const feedback = document.createElement('div');
        feedback.className = 'wishlist-feedback';
        feedback.textContent = `${productName} ${action} ${action === 'added' ? 'to' : 'from'} wishlist!`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-gold);
            color: var(--primary-green-dark);
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    updateWishlistButtons() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const wishlistButtons = document.querySelectorAll('.wishlist-button');

        wishlistButtons.forEach(button => {
            const productId = parseInt(button.dataset.productId);
            const isInWishlist = wishlist.some(item => item.id === productId);
            
            if (isInWishlist) {
                button.classList.add('in-wishlist');
                button.style.backgroundColor = 'var(--accent-gold-light)';
            } else {
                button.classList.remove('in-wishlist');
                button.style.backgroundColor = '';
            }
        });
    }

    viewProduct(productId) {
        // Store product ID for detail page
        localStorage.setItem('current_product_id', productId.toString());
        window.location.href = 'product-detail.html';
    }

    renderProductDetail() {
        const productId = parseInt(localStorage.getItem('current_product_id'));
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            window.location.href = 'products.html';
            return;
        }

        const productDetailContent = document.getElementById('product-detail-content');
        const breadcrumbProduct = document.getElementById('breadcrumb-product');

        if (breadcrumbProduct) {
            breadcrumbProduct.textContent = product.name;
        }

        if (productDetailContent) {
            const priceFormatted = window.alpineSoapApp ? window.alpineSoapApp.formatCurrency(product.price) : `CHF ${product.price.toFixed(2)}`;
            const stockStatus = product.inStock ? 'In Stock' : 'Out of Stock';
            const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
            const addToCartDisabled = product.inStock ? '' : 'disabled';

            productDetailContent.innerHTML = `
                <div class="product-detail-grid">
                    <div class="product-images">
                        <img src="${product.image}" alt="${product.name}" class="product-main-image">
                    </div>
                    <div class="product-info">
                        <h1 class="product-detail-title">${product.name}</h1>
                        <p class="product-detail-category">${this.getCategoryDisplayName(product.category)}</p>
                        <div class="product-detail-price">${priceFormatted}</div>
                        <div class="product-stock ${stockClass}">${stockStatus}</div>
                        <div class="product-weight">Weight: ${product.weight}</div>
                        
                        <div class="product-description">
                            <h3>Description</h3>
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="product-ingredients">
                            <h3>Ingredients</h3>
                            <ul>
                                ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="product-actions">
                            <div class="quantity-selector">
                                <label for="quantity">Quantity:</label>
                                <input type="number" id="quantity" min="1" max="10" value="1" ${addToCartDisabled}>
                            </div>
                            <button class="add-to-cart large" data-product-id="${product.id}" ${addToCartDisabled}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.setupProductDetailEvents();
            this.updateWishlistButtons();
        }

        this.renderRelatedProducts(product);
    }

    setupProductDetailEvents() {
        const addToCartButton = document.querySelector('.add-to-cart.large');
        const wishlistButton = document.querySelector('.wishlist-button.large');
        const quantityInput = document.getElementById('quantity');

        if (addToCartButton) {
            addToCartButton.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const quantity = parseInt(quantityInput.value);
                this.addToCartWithQuantity(productId, quantity);
            });
        }

        if (wishlistButton) {
            wishlistButton.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.toggleWishlist(productId);
            });
        }
    }

    addToCartWithQuantity(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (window.alpineSoapApp) {
            window.alpineSoapApp.updateCartCount();
        }

        this.showAddToCartFeedback(`${quantity}x ${product.name}`);
    }

    renderRelatedProducts(currentProduct) {
        const relatedProductsGrid = document.getElementById('related-products');
        if (!relatedProductsGrid) return;

        const relatedProducts = this.products
            .filter(product => product.category === currentProduct.category && product.id !== currentProduct.id)
            .slice(0, 3);

        if (relatedProducts.length === 0) {
            relatedProductsGrid.parentElement.style.display = 'none';
            return;
        }

        relatedProductsGrid.innerHTML = relatedProducts.map(product => this.createProductCard(product)).join('');
        this.setupProductCardEvents();
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'lavender': 'Lavender Collection',
            'citrus': 'Citrus Fresh',
            'herbs': 'Alpine Herbs',
            'wine': 'Wine Country'
        };
        return categoryNames[category] || category;
    }

    handleCategoryFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            this.currentCategory = category;
            this.filterProducts();
        }
    }

    // Method to get product by ID (for use by other modules)
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Method to get all products (for use by other modules)
    getAllProducts() {
        return this.products;
    }

    // Method to search products
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
        );
    }
}

// Initialize ProductManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
}