// Shopping cart management for Alpine Soap Co.
// Handles cart operations, checkout process, and order management

class CartManager {
    constructor() {
        this.cart = [];
        this.shipping = 8.90;
        this.freeShippingThreshold = 50.00;
        this.init();
    }

    init() {
        this.loadCart();
        this.setupCartPage();
        this.setupCheckoutForm();
        this.updateCartDisplay();
        this.setupEventListeners();
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    setupCartPage() {
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartItems();
            this.renderCartSummary();
        }
    }

    setupCheckoutForm() {
        const checkoutForm = document.getElementById('checkout-form');
        const checkoutButton = document.getElementById('checkout-button');
        const backToCartButton = document.getElementById('back-to-cart');

        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                this.showCheckoutForm();
            });
        }

        if (backToCartButton) {
            backToCartButton.addEventListener('click', () => {
                this.hideCheckoutForm();
            });
        }

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout(checkoutForm);
            });
        }
    }

    setupEventListeners() {
        // Listen for cart updates from product pages
        document.addEventListener('cartUpdated', () => {
            this.loadCart();
            this.updateCartDisplay();
        });

        // Listen for storage changes (for multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.loadCart();
                this.updateCartDisplay();
            }
        });
    }

    addItem(productId, quantity = 1) {
        if (window.productManager) {
            const product = window.productManager.getProductById(productId);
            if (!product || !product.inStock) return false;

            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            this.saveCart();
            this.updateCartDisplay();
            return true;
        }
        return false;
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= this.freeShippingThreshold ? 0 : this.shipping;
    }

    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    formatCurrency(amount) {
        if (window.alpineSoapApp) {
            return window.alpineSoapApp.formatCurrency(amount);
        }
        return `CHF ${amount.toFixed(2)}`;
    }

    updateCartCount() {
        const cartCount = this.getItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
    }

    updateCartDisplay() {
        this.updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartItems();
            this.renderCartSummary();
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        
        if (!cartItemsContainer || !emptyCart) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCart.style.display = 'block';
            return;
        }

        emptyCart.style.display = 'none';
        cartItemsContainer.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        this.setupCartItemEvents();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">${this.formatCurrency(item.price)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-button decrease" data-product-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-product-id="${item.id}">
                            <button class="quantity-button increase" data-product-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    ${this.formatCurrency(item.price * item.quantity)}
                </div>
            </div>
        `;
    }

    setupCartItemEvents() {
        // Quantity controls
        const decreaseButtons = document.querySelectorAll('.quantity-button.decrease');
        const increaseButtons = document.querySelectorAll('.quantity-button.increase');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const removeButtons = document.querySelectorAll('.remove-item');

        decreaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const item = this.cart.find(item => item.id === productId);
                if (item && item.quantity < 10) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const quantity = parseInt(e.target.value);
                if (quantity > 0) {
                    this.updateQuantity(productId, quantity);
                }
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                if (confirm('Are you sure you want to remove this item from your cart?')) {
                    this.removeItem(productId);
                }
            });
        });
    }

    renderCartSummary() {
        const cartSummary = document.getElementById('cart-summary');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotal = document.getElementById('cart-total');

        if (!cartSummary) return;

        const subtotal = this.getSubtotal();
        const shipping = this.getShipping();
        const total = this.getTotal();

        if (this.cart.length === 0) {
            cartSummary.style.display = 'none';
            return;
        }

        cartSummary.style.display = 'block';

        if (cartSubtotal) cartSubtotal.textContent = this.formatCurrency(subtotal);
        if (cartShipping) {
            cartShipping.textContent = shipping === 0 ? 'Free' : this.formatCurrency(shipping);
        }
        if (cartTotal) cartTotal.textContent = this.formatCurrency(total);

        // Show free shipping message if applicable
        if (subtotal < this.freeShippingThreshold) {
            const remaining = this.freeShippingThreshold - subtotal;
            this.showFreeShippingMessage(remaining);
        }
    }

    showFreeShippingMessage(remaining) {
        const cartSummary = document.getElementById('cart-summary');
        if (!cartSummary) return;

        let freeShippingMessage = cartSummary.querySelector('.free-shipping-message');
        if (!freeShippingMessage) {
            freeShippingMessage = document.createElement('div');
            freeShippingMessage.className = 'free-shipping-message';
            freeShippingMessage.style.cssText = `
                background-color: var(--accent-gold-light);
                color: var(--primary-green-dark);
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 16px;
                font-size: 0.9rem;
                text-align: center;
            `;
            cartSummary.insertBefore(freeShippingMessage, cartSummary.firstChild);
        }

        freeShippingMessage.textContent = `Add ${this.formatCurrency(remaining)} more for free shipping!`;
    }

    showCheckoutForm() {
        const cartSection = document.querySelector('.cart-section');
        const checkoutSection = document.getElementById('checkout-section');

        if (cartSection) cartSection.style.display = 'none';
        if (checkoutSection) checkoutSection.style.display = 'block';

        // Scroll to checkout form
        if (checkoutSection) {
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hideCheckoutForm() {
        const cartSection = document.querySelector('.cart-section');
        const checkoutSection = document.getElementById('checkout-section');

        if (cartSection) cartSection.style.display = 'block';
        if (checkoutSection) checkoutSection.style.display = 'none';

        // Scroll to cart
        if (cartSection) {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async handleCheckout(form) {
        const formData = new FormData(form);
        const orderData = {};
        const checkoutMessage = document.getElementById('checkout-message');

        // Collect form data
        for (let [key, value] of formData.entries()) {
            orderData[key] = value;
        }

        // Validate required fields
        const requiredFields = ['name', 'email', 'address', 'city', 'postal', 'country'];
        const missingFields = requiredFields.filter(field => !orderData[field] || !orderData[field].trim());

        if (missingFields.length > 0) {
            this.showCheckoutMessage('Please fill in all required fields', 'error');
            return;
        }

        // Validate email
        if (!this.validateEmail(orderData.email)) {
            this.showCheckoutMessage('Please enter a valid email address', 'error');
            return;
        }

        // Validate cart
        if (this.cart.length === 0) {
            this.showCheckoutMessage('Your cart is empty', 'error');
            return;
        }

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing Order...';
            submitButton.disabled = true;

            // Prepare order data
            const order = {
                id: Date.now().toString(),
                items: [...this.cart],
                customer: orderData,
                subtotal: this.getSubtotal(),
                shipping: this.getShipping(),
                total: this.getTotal(),
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            // Simulate API call
            await this.simulateOrderProcessing(2000);

            // Save order
            this.saveOrder(order);

            // Subscribe to newsletter if requested
            if (orderData.newsletter) {
                this.subscribeToNewsletter(orderData.email);
            }

            // Clear cart
            this.clearCart();

            // Show success message
            this.showOrderConfirmation(order);

            // Reset form
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;

        } catch (error) {
            this.showCheckoutMessage('There was an error processing your order. Please try again.', 'error');
            console.error('Checkout error:', error);
        }
    }

    simulateOrderProcessing(delay) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    subscribeToNewsletter(email) {
        const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        const subscription = {
            email: email,
            timestamp: new Date().toISOString()
        };
        
        if (!subscriptions.some(sub => sub.email === email)) {
            subscriptions.push(subscription);
            localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
        }
    }

    showOrderConfirmation(order) {
        const checkoutSection = document.getElementById('checkout-section');
        if (!checkoutSection) return;

        const confirmationHTML = `
            <div class="order-confirmation">
                <div class="confirmation-header">
                    <h2>Order Confirmed!</h2>
                    <p>Thank you for your order. We'll send you an email confirmation shortly.</p>
                </div>
                
                <div class="order-details">
                    <h3>Order #${order.id}</h3>
                    <p><strong>Order Date:</strong> ${this.formatDate(order.timestamp)}</p>
                    <p><strong>Total:</strong> ${this.formatCurrency(order.total)}</p>
                    
                    <div class="order-items">
                        <h4>Items Ordered:</h4>
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>${this.formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="shipping-info">
                        <h4>Shipping Address:</h4>
                        <p>${order.customer.name}</p>
                        <p>${order.customer.address}</p>
                        <p>${order.customer.city}, ${order.customer.postal}</p>
                        <p>${order.customer.country}</p>
                    </div>
                </div>
                
                <div class="confirmation-actions">
                    <a href="products.html" class="cta-button">Continue Shopping</a>
                    <a href="homepage.html" class="back-button">Back to Home</a>
                </div>
            </div>
        `;

        checkoutSection.innerHTML = confirmationHTML;
    }

    showCheckoutMessage(message, type) {
        const checkoutMessage = document.getElementById('checkout-message');
        if (!checkoutMessage) return;

        checkoutMessage.textContent = message;
        checkoutMessage.className = `form-message ${type}`;
        checkoutMessage.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            checkoutMessage.style.display = 'none';
        }, 5000);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-CH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Method to get cart data for external use
    getCartData() {
        return {
            items: this.cart,
            subtotal: this.getSubtotal(),
            shipping: this.getShipping(),
            total: this.getTotal(),
            itemCount: this.getItemCount()
        };
    }

    // Method to restore cart from backup
    restoreCart(cartData) {
        this.cart = cartData || [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Initialize CartManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
