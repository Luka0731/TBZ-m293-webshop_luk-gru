// Main JavaScript file for Alpine Soap Co.
// Handles global functionality, navigation, and utilities

class AlpineSoapApp {
    constructor() {
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupNewsletterForm();
        this.setupContactForm();
        this.updateCartCount();
        this.handleUrlParams();
        
        // Remove skeleton loading after content is loaded
        setTimeout(() => {
            this.hideSkeletonLoading();
        }, 1000);
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navigation = document.querySelector('.navigation');
        
        if (mobileMenuToggle && navigation) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        const navigation = document.querySelector('.navigation');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navigation && mobileMenuToggle) {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            
            if (this.mobileMenuOpen) {
                navigation.style.display = 'block';
                navigation.style.position = 'absolute';
                navigation.style.top = '100%';
                navigation.style.left = '0';
                navigation.style.right = '0';
                navigation.style.backgroundColor = 'var(--white)';
                navigation.style.boxShadow = 'var(--shadow-medium)';
                navigation.style.padding = 'var(--spacing-md)';
                navigation.style.zIndex = '1000';
                
                const navList = navigation.querySelector('.nav-list');
                if (navList) {
                    navList.style.flexDirection = 'column';
                    navList.style.gap = 'var(--spacing-md)';
                }
            } else {
                navigation.style.display = 'none';
            }
        }
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Form validation utilities
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation (basic)
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = '#c53030';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '4px';
            errorElement.style.display = 'block';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Newsletter form handling
    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        const newsletterMessage = document.getElementById('newsletter-message');
        
        if (newsletterForm && newsletterMessage) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(newsletterForm, newsletterMessage);
            });
        }
    }

    async handleNewsletterSubmit(form, messageElement) {
        const formData = new FormData(form);
        const email = formData.get('email');
        
        // Validate email
        if (!this.validateEmail(email)) {
            this.showMessage(messageElement, 'Please enter a valid email address', 'error');
            return;
        }
        
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Simulate API call
            await this.simulateApiCall(1000);
            
            // Save to local storage
            this.saveNewsletterSubscription(email);
            
            // Show success message
            this.showMessage(messageElement, 'Thank you for subscribing to our newsletter!', 'success');
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
        } catch (error) {
            this.showMessage(messageElement, 'Something went wrong. Please try again.', 'error');
            console.error('Newsletter subscription error:', error);
        }
    }

    // Contact form handling
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        const contactMessage = document.getElementById('contact-message-display');
        
        if (contactForm && contactMessage) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(contactForm, contactMessage);
            });
        }
    }

    async handleContactSubmit(form, messageElement) {
        const formData = new FormData(form);
        const data = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'subject', 'message'];
        for (let field of requiredFields) {
            if (!data[field] || !data[field].trim()) {
                this.showMessage(messageElement, 'Please fill in all required fields', 'error');
                return;
            }
        }
        
        // Validate email
        if (!this.validateEmail(data.email)) {
            this.showMessage(messageElement, 'Please enter a valid email address', 'error');
            return;
        }
        
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            await this.simulateApiCall(1500);
            
            // Save message to local storage
            this.saveContactMessage(data);
            
            // Show success message
            this.showMessage(messageElement, 'Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
        } catch (error) {
            this.showMessage(messageElement, 'Something went wrong. Please try again.', 'error');
            console.error('Contact form error:', error);
        }
    }

    // Utility functions
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(element, message, type) {
        element.textContent = message;
        element.className = `form-message ${type}`;
        element.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    simulateApiCall(delay) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    saveNewsletterSubscription(email) {
        const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        const subscription = {
            email: email,
            timestamp: new Date().toISOString()
        };
        
        // Check if already subscribed
        if (!subscriptions.some(sub => sub.email === email)) {
            subscriptions.push(subscription);
            localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
        }
    }

    saveContactMessage(data) {
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        const message = {
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };
        
        messages.push(message);
        localStorage.setItem('contact_messages', JSON.stringify(messages));
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
    }

    hideSkeletonLoading() {
        const skeletonElements = document.querySelectorAll(
            '.product-skeleton, .product-detail-skeleton, .categories-skeleton, .team-skeleton'
        );
        
        skeletonElements.forEach(element => {
            element.style.display = 'none';
        });
        
        document.body.classList.add('content-loaded');
    }

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && window.location.pathname.includes('products.html')) {
            // Set category filter if on products page
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
                
                // Trigger change event to apply filter
                const event = new Event('change');
                categoryFilter.dispatchEvent(event);
            }
        }
    }

    // Utility method to format currency
    formatCurrency(amount, currency = 'CHF') {
        return new Intl.NumberFormat('de-CH', {
            style: 'currency',
            currency: currency === 'CHF' ? 'CHF' : 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Utility method to format date
    formatDate(date) {
        return new Intl.DateTimeFormat('de-CH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Utility method to debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility method to throttle function calls
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alpineSoapApp = new AlpineSoapApp();
});

// Handle window resize for mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) {
        const navigation = document.querySelector('.navigation');
        if (navigation) {
            navigation.style.display = 'block';
            navigation.style.position = 'static';
            navigation.style.backgroundColor = 'transparent';
            navigation.style.boxShadow = 'none';
            navigation.style.padding = '0';
            
            const navList = navigation.querySelector('.nav-list');
            if (navList) {
                navList.style.flexDirection = 'row';
                navList.style.gap = 'var(--spacing-lg)';
            }
        }
        
        if (window.alpineSoapApp) {
            window.alpineSoapApp.mobileMenuOpen = false;
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlpineSoapApp;
}
