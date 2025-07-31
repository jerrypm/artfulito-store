// Global variables
let currentProduct = null;
let currentImageIndex = 0;

// DOM elements
const productDetail = document.getElementById('productDetail');
const loading = document.getElementById('loading');
const notFound = document.getElementById('notFound');

// Get product ID from URL parameters
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product data
async function loadProduct() {
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        showNotFound();
        return;
    }
    
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const products = await response.json();
        currentProduct = products.find(p => p.id.toString() === productId);
        
        if (!currentProduct) {
            showNotFound();
            return;
        }
        
        renderProductDetail();
        loading.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading product:', error);
        showNotFound();
    }
}

// Show not found state
function showNotFound() {
    loading.style.display = 'none';
    notFound.style.display = 'block';
}

// Format price in IDR
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// Generate multiple images for a product (placeholder function)
function generateProductImages(product) {
    // For now, we'll use the same image with different parameters
    // You can replace these URLs with actual product images later
    const baseImage = product.image;
    
    return [
        baseImage,
        baseImage.replace('w=400&h=400', 'w=400&h=400&sat=-20'), // Slightly different saturation
        baseImage.replace('w=400&h=400', 'w=400&h=400&brightness=10') // Slightly different brightness
    ];
}

// Render product detail
function renderProductDetail() {
    const images = generateProductImages(currentProduct);
    
    const detailHTML = `
        <div class="detail-container">
            <div class="image-gallery">
                <div class="main-image">
                    <img src="${images[0]}" alt="${currentProduct.name}" id="mainImage">
                </div>
                <div class="thumbnail-gallery">
                    ${images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index})">
                            <img src="${img}" alt="${currentProduct.name} - Image ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="product-info">
                <h1 class="product-title">${currentProduct.name}</h1>
                <div class="product-price">${formatPrice(currentProduct.price)}</div>
                
                <div class="product-category">
                    <span class="category-badge">${currentProduct.category}</span>
                </div>
                
                <div class="product-description">
                    <p>${currentProduct.description}</p>
                </div>
                
                <div class="product-features">
                    <h3>Keunggulan Produk:</h3>
                    <ul class="features-list">
                        <li>100% handmade dengan cinta</li>
                        <li>Menggunakan benang berkualitas tinggi</li>
                        <li>Aman untuk anak-anak</li>
                        <li>Dapat dicuci dengan mudah</li>
                        <li>Desain unik dan eksklusif</li>
                    </ul>
                </div>
                
                <div class="contact-section">
                    <h3>Tertarik dengan produk ini?</h3>
                    <p>Hubungi kami untuk informasi lebih lanjut atau untuk memesan produk ini.</p>
                    <div class="contact-buttons">
                        <a href="https://wa.me/6281234567890?text=Halo, saya tertarik dengan ${encodeURIComponent(currentProduct.name)}" class="btn-primary" target="_blank">
                            💬 Chat WhatsApp
                        </a>
                        <a href="mailto:info@artfulito.com?subject=Inquiry about ${encodeURIComponent(currentProduct.name)}" class="btn-secondary">
                            ✉️ Email Kami
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    productDetail.innerHTML = detailHTML;
    
    // Update page title
    document.title = `${currentProduct.name} - Artfulito`;
}

// Change main image when thumbnail is clicked
function changeMainImage(index) {
    const images = generateProductImages(currentProduct);
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Update main image
    mainImage.src = images[index];
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[index].classList.add('active');
    
    currentImageIndex = index;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
});