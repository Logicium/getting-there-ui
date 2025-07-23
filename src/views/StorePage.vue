<script setup lang="ts">
import { onMounted, ref } from 'vue';

// Cart state
const cart = ref([]);
const cartCount = ref(0);

// Book data
const bookData = {
    'goal-achiever': {
        title: 'The Goal Achiever\'s Mind: Psychology of Success',
        author: 'Dr. Sarah Mitchell',
        description: 'This groundbreaking book reveals the psychological principles that separate high achievers from dreamers. Dr. Mitchell combines over 20 years of research with practical strategies that have helped thousands of individuals achieve their most ambitious goals.',
        fullDescription: 'Drawing from cutting-edge research in psychology, neuroscience, and behavioral economics, this comprehensive guide provides readers with the mental frameworks needed for sustainable success. Learn how to reprogram your subconscious mind, develop unshakeable confidence, and maintain motivation even when facing setbacks.',
        specs: {
            'Pages': '324',
            'Published': '2023',
            'ISBN': '978-1-234567-89-0',
            'Language': 'English',
            'Category': 'Psychology, Self-Help'
        }
    },
    'emotional-resilience': {
        title: 'Emotional Resilience: Thriving Through Life\'s Challenges',
        author: 'Dr. Sarah Mitchell',
        description: 'Learn to build unshakeable emotional resilience with evidence-based techniques from psychology and neuroscience. Navigate setbacks with grace and emerge stronger from every challenge.',
        fullDescription: 'In this powerful new release, Dr. Mitchell provides readers with a comprehensive toolkit for developing emotional resilience. Based on the latest research in trauma psychology and post-traumatic growth, this book offers practical strategies for not just surviving difficulties, but using them as catalysts for personal growth.',
        specs: {
            'Pages': '298',
            'Published': '2024',
            'ISBN': '978-1-234567-90-6',
            'Language': 'English',
            'Category': 'Psychology, Mental Health'
        }
    },
    'dreams-reality': {
        title: 'From Dreams to Reality: The Complete Goal-Setting Guide',
        author: 'Dr. Sarah Mitchell',
        description: 'A step-by-step system for turning your biggest dreams into achievable goals. Includes worksheets, templates, and real-world case studies from successful goal achievers.',
        fullDescription: 'This bestselling guide has helped over 50,000 people transform their lives through effective goal setting. The book includes a complete 12-week program with daily exercises, progress tracking tools, and accountability frameworks. Real-world case studies show how ordinary people achieved extraordinary results.',
        specs: {
            'Pages': '412',
            'Published': '2022',
            'ISBN': '978-1-234567-88-3',
            'Language': 'English',
            'Category': 'Self-Help, Productivity'
        }
    },
    'mindful-achiever': {
        title: 'The Mindful Achiever: Balance and Success',
        author: 'Dr. Sarah Mitchell',
        description: 'Integrate mindfulness practices with goal achievement to create sustainable success without burnout. Learn to maintain balance while pursuing ambitious objectives.',
        fullDescription: 'In our fast-paced world, many high achievers struggle with burnout and loss of meaning. This book shows how to integrate mindfulness practices with ambitious goal pursuit, creating a sustainable path to success that honors both achievement and well-being.',
        specs: {
            'Pages': '276',
            'Published': '2023',
            'ISBN': '978-1-234567-91-3',
            'Language': 'English',
            'Category': 'Mindfulness, Success'
        }
    },
    'breaking-through': {
        title: 'Breaking Through: Overcoming Mental Barriers to Success',
        author: 'Dr. Sarah Mitchell',
        description: 'Identify and overcome the mental barriers that keep you stuck. This practical guide helps you reprogram limiting beliefs and develop an unstoppable mindset.',
        fullDescription: 'Most people are held back not by external circumstances, but by internal mental barriers. This book provides a systematic approach to identifying and dismantling the limiting beliefs, fears, and thought patterns that prevent success. Includes cognitive behavioral techniques and neurolinguistic programming strategies.',
        specs: {
            'Pages': '342',
            'Published': '2023',
            'ISBN': '978-1-234567-92-0',
            'Language': 'English',
            'Category': 'Psychology, Mindset'
        }
    },
    '90-day-transformation': {
        title: 'The 90-Day Transformation: Rapid Goal Achievement System',
        author: 'Dr. Sarah Mitchell',
        description: 'Achieve significant progress in just 90 days with this intensive goal achievement system. Includes daily exercises, progress tracking tools, and accountability frameworks.',
        fullDescription: 'This intensive program is designed for people who want rapid, measurable progress. Based on the principle that 90 days is the optimal timeframe for creating lasting change, this book provides a day-by-day roadmap for transformation. Includes digital tools and templates.',
        specs: {
            'Pages': '256',
            'Published': '2024',
            'ISBN': '978-1-234567-93-7',
            'Language': 'English',
            'Category': 'Goal Setting, Transformation'
        }
    }
};

// Filter functionality
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory.includes(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add to cart functionality
function addToCart(bookId, button) {
    const productCard = button.closest('.product-card');
    const selectedFormat = productCard.querySelector('.format-option.selected');
    const bookTitle = productCard.querySelector('.product-title').textContent;
    const format = selectedFormat.dataset.format;
    const price = parseFloat(selectedFormat.dataset.price);

    const cartItem = {
        id: bookId + '-' + format,
        bookId: bookId,
        title: bookTitle,
        format: format === 'digital' ? 'Digital Edition' : 'Print Edition',
        price: price
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.value.findIndex(item => item.id === cartItem.id);
    if (existingItemIndex === -1) {
        cart.value.push(cartItem);
        updateCartUI();
        showAddedToCartFeedback(button);
    } else {
        alert('This item is already in your cart!');
    }
}

function showAddedToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = 'var(--success-color)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'var(--primary-color)';
    }, 1500);
}

function updateCartUI() {
    cartCount.value = cart.value.length;
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const emptyCart = document.getElementById('emptyCart');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.value.length === 0) {
        emptyCart.style.display = 'block';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '<div class="empty-cart" id="emptyCart"><div class="empty-cart-icon">🛒</div><p>Your cart is empty</p><p>Add some books to get started!</p></div>';
    } else {
        emptyCart.style.display = 'none';
        cartFooter.style.display = 'block';
        
        let cartHTML = '';
        let total = 0;
        
        cart.value.forEach((item, index) => {
            total += item.price;
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">📚</div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-format">${item.format}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

function removeFromCart(index) {
    cart.value.splice(index, 1);
    updateCartUI();
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function checkout() {
    if (cart.value.length === 0) return;
    
    const total = cart.value.reduce((sum, item) => sum + item.price, 0);
    alert(`Checkout functionality would integrate with payment processor here.\n\nOrder Summary:\n${cart.value.map(item => `• ${item.title} (${item.format}) - $${item.price.toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nThis would redirect to secure payment with Stripe, PayPal, or similar service.`);
}

// Book preview functionality
function showBookPreview(bookId) {
    const book = bookData[bookId];
    if (!book) return;

    const modal = document.getElementById('bookModal');
    const modalTitle = document.getElementById('modalBookTitle');
    const modalContent = document.getElementById('modalBookContent');

    modalTitle.textContent = book.title;
    
    let specsHTML = '';
    for (const [key, value] of Object.entries(book.specs)) {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `;
    }

    modalContent.innerHTML = `
        <div class="book-preview-image">📚</div>
        <div class="book-details">
            <h3>${book.title}</h3>
            <p><strong>by ${book.author}</strong></p>
            <p>${book.fullDescription}</p>
            
            <div class="book-specs">
                <h4>Book Details</h4>
                ${specsHTML}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookPreview() {
    document.getElementById('bookModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize
onMounted(() => {
    // Format selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.format-option')) {
            const formatOption = e.target.closest('.format-option');
            const productCard = formatOption.closest('.product-card');
            
            // Remove selected class from siblings
            productCard.querySelectorAll('.format-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            formatOption.classList.add('selected');
        }
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });

    // Close modals when clicking outside
    document.getElementById('bookModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBookPreview();
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookPreview();
            closeCart();
        }
    });

    // Fade-in animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    updateCartUI();
});
</script>

<template>
    <section class="store-hero">
        <div class="store-hero-content">
            <h1>Dr. Sarah Mitchell's Books</h1>
            <p>Discover transformational insights through our carefully crafted collection of books on goal achievement, personal development, and psychological wellness.</p>
            
            <div class="author-intro">
                <h3>About the Author</h3>
                <p>Dr. Sarah Mitchell (Sue) holds a PhD in Psychology and has over 20 years of experience helping individuals achieve their goals. Her research-based approach combines scientific rigor with practical application, making complex psychological concepts accessible and actionable.</p>
            </div>
        </div>
    </section>

    <section class="store-filter">
        <div class="filter-content">
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">
                    📚 All Books
                </button>
                <button class="filter-btn" data-filter="bestseller">
                    ⭐ Bestsellers
                </button>
                <button class="filter-btn" data-filter="new">
                    🆕 New Releases
                </button>
                <button class="filter-btn" data-filter="psychology">
                    🧠 Psychology
                </button>
                <button class="filter-btn" data-filter="goals">
                    🎯 Goal Setting
                </button>
            </div>
        </div>
    </section>

    <main class="store-content">
        
        <section class="products-section">
            <h2 class="section-title fade-in">
                📖 Available Books
                <div class="section-divider"></div>
            </h2>
            
            <div class="products-grid" id="productsGrid">
                
                <div class="product-card fade-in" data-category="bestseller psychology goals">
                    <div class="product-image">
                        <div class="bestseller-badge">Bestseller</div>
                        📘
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">The Goal Achiever's Mind: Psychology of Success</h3>
                        <p class="product-author">by Dr. Sarah Mitchell</p>
                        <p class="product-description">Discover the psychological principles that separate high achievers from dreamers. This comprehensive guide combines cutting-edge research with practical strategies for sustainable success.</p>
                        
                        <div class="product-format">
                            <div class="format-option selected" data-format="digital" data-price="19.99">
                                <div class="format-title">Digital Edition</div>
                                <div class="format-price">$19.99</div>
                                <div class="format-delivery">Instant download</div>
                            </div>
                            <div class="format-option" data-format="print" data-price="29.99">
                                <div class="format-title">Print Edition</div>
                                <div class="format-price">$29.99</div>
                                <div class="format-delivery">3-5 business days</div>
                            </div>
                        </div>
                        
                        <div class="product-footer">
                            <button class="add-to-cart-btn" @click="addToCart('goal-achiever', $event.target)">Add to Cart</button>
                            <button class="quick-view-btn" @click="showBookPreview('goal-achiever')">Preview</button>
                        </div>
                    </div>
                </div>

                <div class="product-card fade-in" data-category="new psychology">
                    <div class="product-image">
                        <div class="new-badge">New Release</div>
                        📗
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">Emotional Resilience: Thriving Through Life's Challenges</h3>
                        <p class="product-author">by Dr. Sarah Mitchell</p>
                        <p class="product-description">Learn to build unshakeable emotional resilience with evidence-based techniques from psychology and neuroscience. Navigate setbacks with grace and emerge stronger.</p>
                        
                        <div class="product-format">
                            <div class="format-option selected" data-format="digital" data-price="22.99">
                                <div class="format-title">Digital Edition</div>
                                <div class="format-price">$22.99</div>
                                <div class="format-delivery">Instant download</div>
                            </div>
                            <div class="format-option" data-format="print" data-price="32.99">
                                <div class="format-title">Print Edition</div>
                                <div class="format-price">$32.99</div>
                                <div class="format-delivery">3-5 business days</div>
                            </div>
                        </div>
                        
                        <div class="product-footer">
                            <button class="add-to-cart-btn" @click="addToCart('emotional-resilience', $event.target)">Add to Cart</button>
                            <button class="quick-view-btn" @click="showBookPreview('emotional-resilience')">Preview</button>
                        </div>
                    </div>
                </div>

                <div class="product-card fade-in" data-category="bestseller goals">
                    <div class="product-image">
                        <div class="bestseller-badge">Bestseller</div>
                        📕
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">From Dreams to Reality: The Complete Goal-Setting Guide</h3>
                        <p class="product-author">by Dr. Sarah Mitchell</p>
                        <p class="product-description">A step-by-step system for turning your biggest dreams into achievable goals. Includes worksheets, templates, and real-world case studies from successful goal achievers.</p>
                        
                        <div class="product-format">
                            <div class="format-option selected" data-format="digital" data-price="24.99">
                                <div class="format-title">Digital Edition</div>
                                <div class="format-price">$24.99</div>
                                <div class="format-delivery">Instant download</div>
                            </div>
                            <div class="format-option" data-format="print" data-price="34.99">
                                <div class="format-title">Print Edition</div>
                                <div class="format-price">$34.99</div>
                                <div class="format-delivery">3-5 business days</div>
                            </div>
                        </div>
                        
                        <div class="product-footer">
                            <button class="add-to-cart-btn" @click="addToCart('dreams-reality', $event.target)">Add to Cart</button>
                            <button class="quick-view-btn" @click="showBookPreview('dreams-reality')">Preview</button>
                        </div>
                    </div>
                </div>

                <div class="product-card fade-in" data-category="psychology">
                    <div class="product-image">📙</div>
                    <div class="product-content">
                        <h3 class="product-title">The Mindful Achiever: Balance and Success</h3>
                        <p class="product-author">by Dr. Sarah Mitchell</p>
                        <p class="product-description">Integrate mindfulness practices with goal achievement to create sustainable success without burnout. Learn to maintain balance while pursuing ambitious objectives.</p>
                        
                        <div class="product-format">
                            <div class="format-option selected" data-format="digital" data-price="21.99">
                                <div class="format-title">Digital Edition</div>
                                <div class="format-price">$21.99</div>
                                <div class="format-delivery">Instant download</div>
                            </div>
                            <div class="format-option" data-format="print" data-price="31.99">
                                <div class="format-title">Print Edition</div>
                                <div class="format-price">$31.99</div>
                                <div class="format-delivery">3-5 business days</div>
                            </div>
                        </div>
                        
                        <div class="product-footer">
                            <button class="add-to-cart-btn" @click="addToCart('mindful-achiever', $event.target)">Add to Cart</button>
                            <button class="quick-view-btn" @click="showBookPreview('mindful-achiever')">Preview</button>
                        </div>
                    </div>
                </div>

                <div class="product-card fade-in" data-category="psychology goals">
                    <div class="product-image">📔</div>
                    <div class="product-content">
                        <h3 class="product-title">Breaking Through: Overcoming Mental Barriers to Success</h3>
                        <p class="product-author">by Dr. Sarah Mitchell</p>
                        <p class="product-description">Identify and overcome the mental barriers that keep you stuck. This practical guide helps you reprogram limiting beliefs and develop an unstoppable mindset.</p>
                        
                        <div class="product-format">
                            <div class="format-option selected" data-format="digital" data-price="20.99">
                                <div class="format-title">Digital Edition</div>
                                <div class="format-price">$20.99</div>
                                <div class="format-delivery">Instant download</div>
                            </div>
                            <div class="format-option" data-format="print" data-price="30.99">
                                <div class="format-title">Print Edition</div>
                                <div class="format-price">$30.99</div>
                                <div class="format-delivery">3-5 business days</div>
                            </div>
                        </div>
                        
                        <div class="product-footer">
                            <button class="add-to-cart-btn" @click="addToCart('breaking-through', $event.target)">Add to Cart</button>
                            <button class="quick-view-btn" @click="showBookPreview('breaking-through')">Preview</button>
                        </div>
                    </div>
                </div>

                <div class="product-card fade-in" data-category="new goals">
                    <div class="product-image">
                        <div class="new-badge">New Release</div>
                        📒
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">The 90-Day Transformation: Rapid Goal Achievement System</h3>
                        <p class="product-author">by Dr. Sarah Mitchell</p>
                        <p class="product-description">Achieve significant progress in just 90 days with this intensive goal achievement system. Includes daily exercises, progress tracking tools, and accountability frameworks.</p>
                        
                        <div class="product-format">
                            <div class="format-option selected" data-format="digital" data-price="27.99">
                                <div class="format-title">Digital Edition</div>
                                <div class="format-price">$27.99</div>
                                <div class="format-delivery">Instant download</div>
                            </div>
                            <div class="format-option" data-format="print" data-price="37.99">
                                <div class="format-title">Print Edition</div>
                                <div class="format-price">$37.99</div>
                                <div class="format-delivery">3-5 business days</div>
                            </div>
                        </div>
                        
                        <div class="product-footer">
                            <button class="add-to-cart-btn" @click="addToCart('90-day-transformation', $event.target)">Add to Cart</button>
                            <button class="quick-view-btn" @click="showBookPreview('90-day-transformation')">Preview</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>

    </main>

    <!-- Shopping Cart Sidebar -->
    <div class="cart-overlay" id="cartOverlay" @click="closeCart"></div>
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3 class="cart-title">Shopping Cart</h3>
            <button class="close-cart" @click="closeCart">&times;</button>
        </div>
        
        <div class="cart-items" id="cartItems">
            <div class="empty-cart" id="emptyCart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <p>Add some books to get started!</p>
            </div>
        </div>
        
        <div class="cart-footer" id="cartFooter" style="display: none;">
            <div class="cart-total">
                <span>Total: </span>
                <span id="cartTotal">$0.00</span>
            </div>
            <button class="checkout-btn" @click="checkout">Proceed to Checkout</button>
        </div>
    </div>

    <!-- Book Preview Modal -->
    <div class="book-modal" id="bookModal">
        <div class="book-modal-content">
            <div class="book-modal-header">
                <h3 class="book-modal-title" id="modalBookTitle">Book Preview</h3>
                <button class="close-modal" @click="closeBookPreview">&times;</button>
            </div>
            <div class="book-modal-body" id="modalBookContent">
                <!-- Content will be populated dynamically -->
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Hero Section */
.store-hero {
    padding: 8rem 0 4rem;
    background: var(--gradient);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.store-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></svg>');
    animation: float 20s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}

.store-hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
}

.store-hero h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
}

.store-hero p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.author-intro {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 20px;
    margin-top: 2rem;
    backdrop-filter: blur(10px);
}

.author-intro h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.author-intro p {
    font-size: 1rem;
    opacity: 0.9;
}

/* Filter Section */
.store-filter {
    background: white;
    padding: 2rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    background: var(--bg-light);
    border: 2px solid transparent;
    border-radius: 25px;
    color: var(--text-dark);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-btn:hover, .filter-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
}

/* Main Content */
.store-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.section-divider {
    height: 3px;
    background: var(--gradient);
    border-radius: 2px;
    flex: 1;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.4s ease;
    position: relative;
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.product-image {
    height: 250px;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 4rem;
    position: relative;
}

.bestseller-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--accent-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 700;
}

.new-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--success-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 700;
}

.product-content {
    padding: 2rem;
}

.product-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    line-height: 1.3;
}

.product-author {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
}

.product-description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
}

.product-format {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.format-option {
    flex: 1;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.format-option:hover, .format-option.selected {
    border-color: var(--primary-color);
    background: rgba(37, 99, 235, 0.05);
}

.format-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.format-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.format-delivery {
    font-size: 0.8rem;
    color: var(--text-light);
    margin-top: 0.25rem;
}

.product-footer {
    display: flex;
    gap: 1rem;
}

.add-to-cart-btn {
    flex: 1;
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    border-radius: 25px;
    border: none;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.add-to-cart-btn:disabled {
    background: var(--text-light);
    cursor: not-allowed;
    transform: none;
}

.quick-view-btn {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 1rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-view-btn:hover {
    background: var(--primary-color);
    color: white;
}

/* Shopping Cart Sidebar */
.cart-sidebar {
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    transition: right 0.3s ease;
    overflow-y: auto;
}

.cart-sidebar.open {
    right: 0;
}

.cart-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
}

.close-cart {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-light);
}

.cart-items {
    padding: 2rem;
}

.cart-item {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-image {
    width: 60px;
    height: 80px;
    background: var(--gradient);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.cart-item-details {
    flex: 1;
}

.cart-item-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--text-dark);
}

.cart-item-format {
    font-size: 0.9rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
}

.cart-item-price {
    font-weight: 700;
    color: var(--primary-color);
}

.cart-item-remove {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 1.2rem;
}

.cart-footer {
    padding: 2rem;
    border-top: 1px solid #e5e7eb;
}

.cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    font-weight: 700;
}

.checkout-btn {
    width: 100%;
    background: var(--accent-color);
    color: white;
    padding: 1rem;
    border-radius: 25px;
    border: none;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.checkout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

.checkout-btn:disabled {
    background: var(--text-light);
    cursor: not-allowed;
    transform: none;
}

.empty-cart {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--text-light);
}

.empty-cart-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

/* Book Preview Modal */
.book-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    align-items: center;
    justify-content: center;
}

.book-modal.active {
    display: flex;
}

.book-modal-content {
    background: white;
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    max-height: 90%;
    overflow-y: auto;
    position: relative;
}

.book-modal-header {
    padding: 2rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.book-modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
}

.book-modal-body {
    padding: 2rem;
}

.book-preview-image {
    width: 150px;
    height: 200px;
    background: var(--gradient);
    border-radius: 10px;
    margin: 0 auto 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 3rem;
}

.book-details h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.book-details p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.book-specs {
    background: var(--bg-light);
    padding: 1.5rem;
    border-radius: 10px;
    margin: 1.5rem 0;
}

.book-specs h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.spec-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.spec-label {
    color: var(--text-light);
}

.spec-value {
    font-weight: 600;
    color: var(--text-dark);
}

/* Cart overlay */
.cart-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1500;
}

.cart-overlay.active {
    display: block;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: 1fr;
    }

    .cart-sidebar {
        width: 100%;
        right: -100%;
    }

    .product-format {
        flex-direction: column;
    }

    .product-footer {
        flex-direction: column;
    }
}

/* Animations */
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
</style>