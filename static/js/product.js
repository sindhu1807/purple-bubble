const products = [
  {
    id: 1,
    name: "2025 Calendar",
    price: 299,
    image: "images/product1.jpg",
    description: "Plan your dreamy days in 2025 with this pastel calendar."
  },
  {
    id: 2,
    name: "Dream Journal",
    price: 249,
    image: "images/product2.jpg",
    description: "Pen your thoughts, doodles, and dreams in this softcover journal."
  },
  {
    id: 3,
    name: "Sticker Set",
    price: 149,
    image: "images/product3.jpg",
    description: "A set of 50+ artsy, kawaii stickers for journals and laptops."
  }
];

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const product = products.find(p => p.id === id);

if (product) {
  document.getElementById("detail-img").src = product.image;
  document.getElementById("detail-title").textContent = product.name;
  document.getElementById("detail-price").textContent = `₹${product.price}`;
  document.getElementById("detail-desc").textContent = product.description;

  document.getElementById("add-to-cart").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart! 🛒");
  });
}
