import { toast } from "react-hot-toast";

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

export async function getWishlist() {
  try {
    const key = storageKeyFor("wishlist");
    const raw = localStorage.getItem(key);
    const wishlist = raw ? JSON.parse(raw) : [];
    return Array.isArray(wishlist) ? wishlist : [];
  } catch {
    return [];
  }
}

export async function addToWishlist(product) {
  try {
    if (!product || !product.productId) {
      toast.error("Invalid product");
      return false;
    }
    const key = storageKeyFor("wishlist");
    const raw = localStorage.getItem(key);
    const wishlist = raw ? JSON.parse(raw) : [];

    const exists = wishlist.some((item) => item.productId === product.productId);
    if (exists) {
      toast("Already in wishlist");
      return false;
    }

    const updatedWishlist = [
      ...wishlist,
      {
        productId: product.productId,
        name: product.name,
        price: product.price,
        labelledPrice: product.labelledPrice,
        images: product.images || [],
      },
    ];
    localStorage.setItem(key, JSON.stringify(updatedWishlist));
    toast.success("Added to wishlist");
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    toast.error("Failed to add to wishlist");
    return false;
  }
}

export async function removeFromWishlist(productId) {
  try {
    const key = storageKeyFor("wishlist");
    const raw = localStorage.getItem(key);
    const wishlist = raw ? JSON.parse(raw) : [];
    const updatedWishlist = wishlist.filter((item) => item.productId !== productId);
    localStorage.setItem(key, JSON.stringify(updatedWishlist));
    return true;
  } catch (error) {
    toast.error("Failed to remove from wishlist");
    return false;
  }
}

export async function isInWishlist(productId) {
  try {
    const wishlist = await getWishlist();
    return wishlist.some((item) => item.productId === productId);
  } catch {
    return false;
  }
}
