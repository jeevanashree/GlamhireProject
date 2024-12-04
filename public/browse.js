const clothingData = [
    {
      id: 1,
      name: "Elegant Red Dress",
      price: "$79.99",
      image: "https://via.placeholder.com/250x300?text=Red+Dress",
      description: "Perfect for weddings and formal gatherings.",
      event: "wedding",
      gender: "women",
      rental: "$30/day",
      purchase: "$79.99"
    },
    {
      id: 2,
      name: "Men's Black Tuxedo",
      price: "$99.99",
      image: "https://via.placeholder.com/250x300?text=Tuxedo",
      description: "Ideal for formal events and parties.",
      event: "formal",
      gender: "men",
      rental: "$40/day",
      purchase: "$99.99"
    },
    // More mock data items
  ];
  
  // Function to filter clothing based on the user's selection
  function filterClothing() {
    const eventType = document.getElementById("event-type").value;
    const gender = document.getElementById("gender").value;
    const option = document.getElementById("option").value;
  
    // Filter the data based on selected criteria
    const filteredData = clothingData.filter(item => {
      return (
        (item.event === eventType || eventType === "both") &&
        (item.gender === gender || gender === "both") &&
        (option === "both" || (option === "rent" && item.rental) || (option === "buy" && item.purchase))
      );
    });
  
    // Clear previous results
    const clothingContainer = document.getElementById("clothing-items");
    clothingContainer.innerHTML = "";
  
    // Add filtered products to the page
    filteredData.forEach(item => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-item");
  
      productElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p class="price">Rental: ${item.rental} | Purchase: ${item.purchase}</p>
        <button class="button">Rent Now</button>
        <button class="button">Buy Now</button>
      `;
  
      clothingContainer.appendChild(productElement);
    });
  }
  
  // Event listener for filter changes
  document.getElementById("apply-filters").addEventListener("click", filterClothing);
  
  // Load all clothing items by default
  window.onload = filterClothing;