// New utils/wishlist.js (create this file in the utils directory)
export const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const addToWishlist = (product) => {
  let wishlist = getWishlist();
  const exists = wishlist.some((item) => item.productId === product.productId);
  if (!exists) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
  return wishlist;
};

export const removeFromWishlist = (productId) => {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((item) => item.productId !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  return wishlist;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.productId === productId);
};