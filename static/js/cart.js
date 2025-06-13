document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const item = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        img: button.dataset.img,
        quantity: 1,
      };

      addToCart(item);
      showAddedPopup(button);
      updateCartCount();
    });
  });

  updateCartCount(); // Load cart count on page load
});

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(i => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

function showAddedPopup(button) {
  const popup = document.createElement("span");
  popup.innerText = "Added 💜";
  popup.className = "cart-popup";

  // Positioning & styling
  popup.style.position = "absolute";
  popup.style.top = "-1.5rem";
  popup.style.right = "0.5rem";
  popup.style.background = "#fff";
  popup.style.color = "#b36be3";
  popup.style.fontWeight = "bold";
  popup.style.borderRadius = "8px";
  popup.style.padding = "4px 10px";
  popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  popup.style.fontSize = "0.8rem";
  popup.style.zIndex = "10";

  button.style.position = "relative";
  button.appendChild(popup);

  setTimeout(() => popup.remove(), 1000);
}
