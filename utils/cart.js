export function getCart() {
  let cart = localStorage.getItem("cart");
  try {
    cart = JSON.parse(cart);
  } catch {
    cart = null; // fallback if corrupted
  }

  if (!cart || !Array.isArray(cart)) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
}

export function addToCart(product, qty) {
  if (!product || typeof qty !== "number") return;
  let cart = getCart();
  const index = cart.findIndex((item) => item.productId === product.productId);
  if (index === -1) {
    cart.push({
      productId: product.productId,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150",
      price: product.price,
      labelledPrice: product.labelledPrice,
      qty: qty,
    });
  } else {
    const newQty = cart[index].qty + qty;
    if (newQty < 1) {
      removeFromCart(product.productId);
      return;
    } else {
      cart[index].qty = newQty;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(productId) {
  let cart = getCart();
  const newCart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(newCart));
}

export function getTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
}