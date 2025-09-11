function safeBase64Decode(str) {
  try {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return atob(str);
  } catch {
    return null;
  }
}

function parseJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = safeBase64Decode(parts[1]);
    if (!decoded) return null;
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function ensureGuestId() {
  let guest = localStorage.getItem("guest_id");
  if (!guest) {
    guest = `guest_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("guest_id", guest);
  }
  return guest;
}

function getCurrentUserId() {
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);
  if (payload) {
    if (payload.sub) return payload.sub;
    if (payload.id) return payload.id;
    if (payload.email) return payload.email;
  }
  return ensureGuestId();
}

function storageKeyFor(prefix) {
  const userId = getCurrentUserId();
  return `${prefix}_${userId}`;
}

/* ----------------- Public API ----------------- */

export function getCart() {
  const key = storageKeyFor("cart");
  let cart = localStorage.getItem(key);
  try {
    cart = cart ? JSON.parse(cart) : [];
  } catch {
    cart = [];
  }
  if (!Array.isArray(cart)) {
    cart = [];
    localStorage.setItem(key, JSON.stringify(cart));
  }
  return cart;
}


export function addToCart(product, qty) {
  if (!product || typeof qty !== "number") return;
  const key = storageKeyFor("cart");
  let cart = getCart();
  const index = cart.findIndex((item) => item.productId === product.productId);

  if (index === -1) {
    if (qty <= 0) return;
    cart.push({
      productId: product.productId,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150",
      price: product.price,
      labelledPrice: product.labelledPrice,
      qty: qty,
    });
  } else {
    const newQty = (cart[index].qty || 0) + qty;
    if (newQty < 1) {
      cart = cart.filter((item) => item.productId !== product.productId);
    } else {
      cart[index].qty = newQty;
    }
  }

  localStorage.setItem(key, JSON.stringify(cart));
}

export function removeFromCart(productId) {
  const key = storageKeyFor("cart");
  let cart = getCart();
  const newCart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem(key, JSON.stringify(newCart));
}

export function getTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
}
