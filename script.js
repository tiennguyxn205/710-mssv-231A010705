// ==========================
// BÀI 1: Products + Search (KHÔNG ẢNH + CÓ NÚT + GIỎ HÀNG)
// ==========================
const phoneGrid = document.getElementById("phoneGrid");
const phoneInput = document.getElementById("phoneSearchInput");
const phoneError = document.getElementById("phoneError");

// ✅ 5 sản phẩm điện thoại di động
const phones = [
  { id: 1, name: "iPhone 15 Pro Max 256GB", brand: "Apple", price: 32990000 },
  { id: 2, name: "Samsung Galaxy S24 Ultra 256GB", brand: "Samsung", price: 30990000 },
  { id: 3, name: "Xiaomi 14 256GB", brand: "Xiaomi", price: 18990000 },
  { id: 4, name: "OPPO Reno 11 5G 256GB", brand: "OPPO", price: 10990000 },
  { id: 5, name: "Vivo V29e 256GB", brand: "Vivo", price: 7990000 }
].map(p => ({ ...p, key: normalizeText(p.name) }));

let phoneView = [...phones];

// Giỏ hàng (lưu LocalStorage để reload không mất)
let cart = JSON.parse(localStorage.getItem("phoneCart") || "[]");

function saveCart() {
  localStorage.setItem("phoneCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cart.length;
}

function addToCart(product) {
  cart.push({ id: product.id, name: product.name, brand: product.brand, price: product.price });
  saveCart();
  alert(`🛒 Đã thêm vào giỏ: ${product.name}`);
}

function viewCart() {
  if (cart.length === 0) {
    alert("🛒 Giỏ hàng đang trống!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const list = cart
    .map((item, i) => `${i + 1}. ${item.name} - ${formatVND(item.price)}`)
    .join("\n");

  alert(`🧾 GIỎ HÀNG (${cart.length} sản phẩm)\n\n${list}\n\n✅ Tổng: ${formatVND(total)}`);
}

function clearCart() {
  cart = [];
  saveCart();
  alert("✅ Đã xoá giỏ hàng!");
}

function renderPhones(list) {
  if (!phoneGrid) return;
  phoneGrid.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const h3 = document.createElement("h3");
    h3.textContent = p.name; // textContent tránh injection

    const meta = document.createElement("p");
    meta.className = "muted";
    meta.textContent = `Hãng: ${p.brand}`;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatVND(p.price);

    // ✅ Nút bấm sản phẩm
    const btnRow = document.createElement("div");
    btnRow.className = "btn-row";

    const btnBuy = document.createElement("button");
    btnBuy.className = "btn";
    btnBuy.textContent = "🛍 Mua ngay";
    btnBuy.addEventListener("click", () => {
      alert(`✅ Bạn chọn mua: ${p.name}\n💰 Giá: ${formatVND(p.price)}`);
    });

    const btnAdd = document.createElement("button");
    btnAdd.className = "btn btn--ghost";
    btnAdd.textContent = "➕ Thêm vào giỏ";
    btnAdd.addEventListener("click", () => addToCart(p));

    const btnDetail = document.createElement("button");
    btnDetail.className = "btn btn--ghost";
    btnDetail.textContent = "ℹ Chi tiết";
    btnDetail.addEventListener("click", () => {
      alert(`Tên: ${p.name}\nHãng: ${p.brand}\nGiá: ${formatVND(p.price)}`);
    });

    btnRow.appendChild(btnBuy);
    btnRow.appendChild(btnAdd);
    btnRow.appendChild(btnDetail);

    card.appendChild(h3);
    card.appendChild(meta);
    card.appendChild(price);
    card.appendChild(btnRow);

    phoneGrid.appendChild(card);
  });
}

function searchPhones() {
  if (!phoneInput) return;
  const keyword = normalizeText(phoneInput.value);

  if (!keyword) {
    phoneView = [...phones];
    if (phoneError) phoneError.textContent = "";
    renderPhones(phoneView);
    return;
  }

  const result = phones.filter(p => p.key.includes(keyword));

  if (phoneError) {
    phoneError.textContent = result.length ? "" : "❌ Không tìm thấy sản phẩm phù hợp!";
  }
  phoneView = result;
  renderPhones(phoneView);
}

function resetPhones() {
  if (phoneInput) phoneInput.value = "";
  if (phoneError) phoneError.textContent = "";
  phoneView = [...phones];
  renderPhones(phoneView);
}

function sortPhonesAsc() {
  phoneView = [...phoneView].sort((a, b) => a.price - b.price);
  renderPhones(phoneView);
}

function sortPhonesDesc() {
  phoneView = [...phoneView].sort((a, b) => b.price - a.price);
  renderPhones(phoneView);
}

if (phoneGrid) {
  renderPhones(phoneView);
  updateCartCount();

  const btnSearch = document.getElementById("btnSearchPhone");
  const btnReset = document.getElementById("btnResetPhone");
  const btnAsc = document.getElementById("btnSortAsc");
  const btnDesc = document.getElementById("btnSortDesc");

  const btnViewCart = document.getElementById("btnViewCart");
  const btnClearCart = document.getElementById("btnClearCart");

  btnSearch?.addEventListener("click", searchPhones);
  btnReset?.addEventListener("click", resetPhones);
  btnAsc?.addEventListener("click", sortPhonesAsc);
  btnDesc?.addEventListener("click", sortPhonesDesc);

  btnViewCart?.addEventListener("click", viewCart);
  btnClearCart?.addEventListener("click", clearCart);

  phoneInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchPhones();
  });
}
