let cart = [];
let cartCount = 0;
let totalPrice = 0;

function addToCart(product, price) {
    cart.push({ product, price });
    cartCount++;
    totalPrice += price;
    updateCart();
    saveCart();
    showNotification(`${product} добавлен в корзину!`);
}

function updateCart() {
    document.getElementById('cart-count').innerText = cartCount;
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `${item.product} - ${item.price} руб.
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Удалить</button>`;
            cartItems.appendChild(li);
        });
        document.getElementById('total-price').innerText = totalPrice;
    }
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    cartCount--;
    totalPrice -= item.price;
    updateCart();
    saveCart();
}

function clearCart() {
    if (confirm("Вы уверены, что хотите очистить корзину?")) {
        cart = [];
        cartCount = 0;
        totalPrice = 0;
        updateCart();
        localStorage.removeItem('cart');
        localStorage.removeItem('cartCount');
        localStorage.removeItem('totalPrice');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
    localStorage.setItem('totalPrice', totalPrice);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

window.onload = function() {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        cartCount = parseInt(localStorage.getItem('cartCount'), 10) || 0;
        totalPrice = parseInt(localStorage.getItem('totalPrice'), 10) || 0;
        updateCart();
    }
    document.getElementById('search-query').addEventListener('input', autoCompleteSearch);
}

const products = [
    { name: 'Цемент', price: 500, img: 'cement.jpg', category: 'cement' },
    { name: 'Кирпич', price: 20, img: 'brick.jpg', category: 'brick' },
    { name: 'Песок', price: 1000, img: 'sand.jpg', category: 'sand' },
    { name: 'Древесина', price: 1500, img: 'wood.jpg', category: 'wood' },
    { name: 'Металл', price: 2500, img: 'metal.jpg', category: 'metal' },
    { name: 'Стекло', price: 800, img: 'glass.jpg', category: 'glass' }
];

document.getElementById('category-filter').addEventListener('change', filterProducts);
document.getElementById('sort-filter').addEventListener('change', filterProducts);

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    let filteredProducts = products;

    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (sort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Цена: ${product.price} руб.</p>
                        <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price})">Добавить в корзину</button>
                    </div>
                </div>
            </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    updateCart();
});

function autoCompleteSearch() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const results = products.filter(product => product.name.toLowerCase().includes(query));
    displayAutocompleteResults(results);
}

function displayAutocompleteResults(results) {
    const resultsContainer = document.getElementById('autocomplete-results');
    resultsContainer.innerHTML = '';

    results.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'autocomplete-item';
        resultItem.innerText = product.name;
        resultItem.onclick = () => {
            document.getElementById('search-query').value = product.name;
            resultsContainer.innerHTML = '';
        };
        resultsContainer.appendChild(resultItem);
    });
}
