// Cart management utilities
import type { CartItem } from '@/types/store';

const CART_STORAGE_KEY = 'gettingThereCart';

/**
 * Load cart from localStorage
 */
export function loadCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (err) {
    console.error('Error loading cart:', err);
  }
  return [];
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Error saving cart:', err);
  }
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cart: CartItem[]): { count: number; total: number } {
  return {
    count: cart.length,
    total: cart.reduce((sum, item) => sum + item.price, 0)
  };
}

/**
 * Show visual feedback when item is added to cart
 */
export function showAddedToCartFeedback(button: HTMLElement): void {
  const originalText = button.textContent;
  button.textContent = 'Added! ✓';
  button.style.background = 'var(--success-color)';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'var(--primary-color)';
  }, 1500);
}

/**
 * Check if item already exists in cart
 */
export function isItemInCart(cart: CartItem[], itemId: string): boolean {
  return cart.some(item => item.id === itemId);
}
