const productList = document.getElementById('product-list');
const productModal = document.getElementById('product-modal');
const closeBtn = document.querySelector('.close-btn');
const buyBtn = document.getElementById('buy-btn');
const rentBtn = document.getElementById('rent-btn');

const apiURL = 'https://fakestoreapi.com/products';

function displayProducts(products) {
    products.forEach(product => {
        // Filter for men's clothing category only
        if (product.category.toLowerCase().includes("men's clothing")) {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="category">${product.category}</p>
                <p class="price">$${product.price}</p>
            `;

            // Show modal when clicking on the product
            productElement.addEventListener('click', () => showProductModal(product));

            productList.appendChild(productElement);
        }
    });
}

function showProductModal(product) {
    document.getElementById('product-name').textContent = product.title;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = product.price;

    productModal.style.display = 'flex';
}

// Close modal
closeBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Fetch product data from Fake Store API
fetch(apiURL)
    .then(response => response.json())
    .then(data => displayProducts(data.slice(0, 50)))  // Get 50 men's clothing products
    .catch(error => console.error('Error fetching products:', error));
