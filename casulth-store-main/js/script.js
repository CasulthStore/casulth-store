// =======================
// DATA KERANJANG
// =======================

let cart = JSON.parse(localStorage.getItem("cartData") || "[]");
const THEME_KEY = "casulthTheme";

function saveCart() {
    localStorage.setItem("cartData", JSON.stringify(cart));
}

// Hitung jumlah item dan tampilkan di icon keranjang
function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (!countEl) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
}

// Animasi bola terbang ke icon keranjang
function animateAddToCart(btn) {
    const cartIcon = document.querySelector(".cart-icon");
    if (!btn || !cartIcon) return;

    const btnRect = btn.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const ball = document.createElement("div");
    ball.className = "flying-ball";
    ball.style.left = (btnRect.left + btnRect.width / 2) + "px";
    ball.style.top = (btnRect.top + btnRect.height / 2) + "px";
    document.body.appendChild(ball);

    requestAnimationFrame(() => {
        const translateX =
            cartRect.left + cartRect.width / 2 - (btnRect.left + btnRect.width / 2);
        const translateY =
            cartRect.top + cartRect.height / 2 - (btnRect.top + btnRect.height / 2);

        ball.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
        ball.style.opacity = "0";
    });

    ball.addEventListener("transitionend", () => ball.remove());

    // Animasi "bump" di icon keranjang
    cartIcon.classList.add("cart-bump");
    setTimeout(() => cartIcon.classList.remove("cart-bump"), 300);
}

// Tambah produk ke keranjang
function addToCart(name, price, btn) {
    const product = cart.find(item => item.name === name);

    if (product) {
        product.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();

    if (btn) {
        animateAddToCart(btn);
    }
}

// Update tampilan keranjang di halaman utama
function updateCart() {
    const cartList = document.getElementById("cart-list");
    const totalElement = document.getElementById("total");

    if (cartList && totalElement) {
        cartList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - Rp ${item.price.toLocaleString("id-ID")} x ${item.quantity}
                <button onclick="increaseQty(${index})">+</button>
                <button onclick="decreaseQty(${index})">-</button>
                <button onclick="removeItem(${index})">❌</button>
            `;
            cartList.appendChild(li);
        });

        totalElement.textContent = `Total: Rp ${total.toLocaleString("id-ID")}`;
    }

    updateCartCount();
    saveCart();
}

function increaseQty(i) {
    cart[i].quantity++;
    updateCart();
}

function decreaseQty(i) {
    if (cart[i].quantity > 1) {
        cart[i].quantity--;
    } else {
        cart.splice(i, 1);
    }
    updateCart();
}

function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    window.location.href = "checkout.html";
}

// =======================
// DARK / LIGHT MODE
// =======================

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.textContent = isDark ? "☀️" : "🌙";
    }

    localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
    const isDarkNow = document.body.classList.contains("dark-mode");
    applyTheme(isDarkNow ? "light" : "dark");
}

// Inisialisasi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);
    updateCart();
});
