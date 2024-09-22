// CSS Styles
const styles = `
.add-to-cart-btn {
    background-color: #B81A1B;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-radius: 5px;
    font-family: Arial, sans-serif;
}

.add-to-cart-btn:hover {
    background-color: #B81A1B;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}

.add-to-cart-btn:active {
    background-color: #B81A1B;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    transform: translateY(4px);
}

.add-to-cart-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px #B81A1B;
}

/* New styles for the remove button */
.cart-item button {
    background-color: #B81A1B;
    border: none;
    color: white;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 0 10px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-radius: 3px;
    font-family: Arial, sans-serif;
}

.cart-item button:hover {
    background-color: #950F10;
    box-shadow: 0 6px 8px 0 rgba(0,0,0,0.24), 0 8px 25px 0 rgba(0,0,0,0.19);
}

.cart-item button:active {
    background-color: #950F10;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 3px 10px 0 rgba(0,0,0,0.19);
    transform: translateY(2px);
}

.cart-item button:focus {
    outline: none;
    box-shadow: 0 0 0 2px #B81A1B;
}
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Existing JavaScript functions
function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    products.forEach((product) => {
      if (category === 'all' || product.dataset.category === category) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function toggleProfileCard() {
    const profileCard = document.getElementById('profileCard');
    if (profileCard.style.display === 'none' || profileCard.style.display === '') {
      profileCard.style.display = 'block';
    } else {
      profileCard.style.display = 'none';
    }
}

// Cart functionality
let cart = [];

function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, image, quantity: 1 });
    }
    updateCartDisplay();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Add to cart buttons on the main page
document.querySelectorAll('.product-item').forEach(item => {
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.className = 'add-to-cart-btn';
    addToCartBtn.onclick = function() {
        const productId = parseInt(item.dataset.productId);
        const name = item.querySelector('h3').textContent;
        const price = parseFloat(item.querySelector('p').textContent.replace('$', ''));
        const image = item.querySelector('img').src;
        addToCart(productId, name, price, image);
    };
    item.appendChild(addToCartBtn);
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartDisplay();
});

// Checkout button functionality
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        alert('Thank you for your purchase!');
        cart = [];
        updateCartDisplay();
        saveCart();
    });
}

function logout() {
  alert("You have been logged out.");
  // Redirect to the login page or perform other logout actions
  window.location.href = "login.html"; // Assuming you have a login page
}
