document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
  updateCartCount();
});

function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total");

  cartItemsContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is feeling a little empty right now 🥺</p>`;
    totalSpan.textContent = "0";
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-img"/>
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="qty-control">
          <button class="decrease" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(itemEl);
  });

  totalSpan.textContent = total.toFixed(2);

  // Event listeners for quantity and removal
  document.querySelectorAll(".increase").forEach(btn =>
    btn.addEventListener("click", () => changeQuantity(btn.dataset.id, 1))
  );
  document.querySelectorAll(".decrease").forEach(btn =>
    btn.addEventListener("click", () => changeQuantity(btn.dataset.id, -1))
  );
  document.querySelectorAll(".remove").forEach(btn =>
    btn.addEventListener("click", () => removeItem(btn.dataset.id))
  );
}

function changeQuantity(id, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.map(item => {
    if (item.id === id) {
      item.quantity += delta;
      if (item.quantity < 1) item.quantity = 1;
    }
    return item;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartItems();
  updateCartCount();
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartItems();
  updateCartCount();
}
