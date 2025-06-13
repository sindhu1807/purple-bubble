document.addEventListener("DOMContentLoaded", () => {
  displaySummary();

  document.getElementById("place-order-btn").addEventListener("click", () => {
    const form = document.getElementById("checkout-form");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const shippingDetails = Object.fromEntries(formData.entries());

    localStorage.setItem("shipping", JSON.stringify(shippingDetails));
    alert("Order placed successfully 💜 Your dreamy goodies are on the way!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  });
});

function displaySummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summaryContainer = document.getElementById("summary-items");
  const totalElement = document.getElementById("summary-total");
  let total = 0;

  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Your cart is empty 😿</p>";
    totalElement.textContent = "0";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>₹${item.price * item.quantity}</span>
    `;
    summaryContainer.appendChild(div);
    total += item.price * item.quantity;
  });

  totalElement.textContent = total.toFixed(2);
}
