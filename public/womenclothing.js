document.addEventListener('DOMContentLoaded', function() {
    // Mock API URL to get women's products
    const apiUrl = 'https://fakestoreapi.com/products/category/women\'s clothing';  // Replace with actual API
    
    // Fetch the products from the mock API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const productList = document.getElementById('product-list');
        
        // Simulating user history for AI recommendations (this would come dynamically)
        const userHistory = ["previous_purchase", "viewed_dresses", "liked_tops"];
  
        // Here we simulate product ranking or recommendation
        const sortedProducts = data.sort((a, b) => a.price - b.price); // Sorting by price for simplicity
  
        // Loop through products and create HTML elements
        sortedProducts.forEach(product => {
          const productCard = document.createElement('div');
          productCard.classList.add('product-card');
          productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button class="view-details-btn">View Details</button>
            <div class="buy-rent-btns">
              <button class="buy">Buy - $${product.price}</button>
              <button class="rent">Rent - $${(product.price * 0.2).toFixed(2)}</button>
            </div>
          `;
  
          // Add functionality for clicking on the dress
          productCard.querySelector('.view-details-btn').addEventListener('click', function() {
            const buttons = productCard.querySelector('.buy-rent-btns');
            buttons.style.display = 'block'; // Show Buy/Rent buttons when clicked
          });
  
          productList.appendChild(productCard);
        });
      })
      .catch(error => console.error('Error fetching products:', error));
  });