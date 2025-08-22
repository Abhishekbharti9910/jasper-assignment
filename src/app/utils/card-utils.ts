import { Product } from '../api/products/route';

export interface CartItem extends Product {
  quantity: number;
  addedAt: string;
}

export const CART_STORAGE_KEY = 'premium-store-cart';
export const WISHLIST_STORAGE_KEY = 'premium-store-wishlist';

// Cart Management Functions
export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (product: Product): CartItem[] => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
  
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += 1;
  } else {
    const newCartItem: CartItem = {
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString()
    };
    cartItems.push(newCartItem);
  }
  
  saveCartItems(cartItems);
  return cartItems;
};

export const removeFromCart = (productId: number): CartItem[] => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter(item => item.id !== productId);
  saveCartItems(updatedCart);
  return updatedCart;
};

export const updateCartItemQuantity = (productId: number, quantity: number): CartItem[] => {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.id === productId);
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = quantity;
    }
  }
  
  saveCartItems(cartItems);
  return cartItems;
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
};

export const getCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', '').replace(',', ''));
    return total + (price * item.quantity);
  }, 0);
};

export const getCartItemsCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Wishlist Management Functions
export const getWishlistItems = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const wishlistData = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlistData ? JSON.parse(wishlistData) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
};

export const saveWishlistItems = (items: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

export const addToWishlist = (product: Product): Product[] => {
  const wishlistItems = getWishlistItems();
  const existingItem = wishlistItems.find(item => item.id === product.id);
  
  if (!existingItem) {
    wishlistItems.push(product);
    saveWishlistItems(wishlistItems);
  }
  
  return wishlistItems;
};

export const removeFromWishlist = (productId: number): Product[] => {
  const wishlistItems = getWishlistItems();
  const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
  saveWishlistItems(updatedWishlist);
  return updatedWishlist;
};

export const toggleWishlist = (product: Product): { items: Product[], isAdded: boolean } => {
  const wishlistItems = getWishlistItems();
  const existingItemIndex = wishlistItems.findIndex(item => item.id === product.id);
  
  if (existingItemIndex > -1) {
    wishlistItems.splice(existingItemIndex, 1);
    saveWishlistItems(wishlistItems);
    return { items: wishlistItems, isAdded: false };
  } else {
    wishlistItems.push(product);
    saveWishlistItems(wishlistItems);
    return { items: wishlistItems, isAdded: true };
  }
};