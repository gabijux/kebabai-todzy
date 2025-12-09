// Simple client-side cart stored in localStorage under key 'cart'
const CART_KEY = 'cart'

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return { items: [], createdAt: null }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to read cart', e)
    return { items: [], createdAt: null }
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch (e) {
    console.error('Failed to write cart', e)
  }
}

export function getCart() {
  return readCart()
}

export function getItemCount() {
  const cart = readCart()
  return cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0)
}

export function addToCart(kebab) {
  if (!kebab) return
  const cart = readCart()
  if (!cart.createdAt) cart.createdAt = new Date().toISOString()

  // Keep only necessary fields for storage to avoid circular references
  const itemData = {
    id: kebab.id ?? kebab.Id ?? kebab.kebabId ?? null,
    name: kebab.name ?? kebab.title ?? 'Kebabas',
    // if price exists, preserve it
    price: kebab.price ?? kebab.pricePerUnit ?? null,
  }

  // find existing
  const existing = cart.items.find(i => i.id === itemData.id)
  if (existing) {
    existing.quantity = (existing.quantity || 0) + 1
  } else {
    cart.items.push({ ...itemData, quantity: 1 })
  }

  writeCart(cart)
}

export function removeFromCart(id) {
  const cart = readCart()
  const idx = cart.items.findIndex(i => i.id === id)
  if (idx === -1) return
  // decrement quantity, remove if zero
  if ((cart.items[idx].quantity || 0) > 1) {
    cart.items[idx].quantity -= 1
  } else {
    cart.items.splice(idx, 1)
  }
  // if no items left, clear createdAt
  if (cart.items.length === 0) cart.createdAt = null
  writeCart(cart)
}

export function removeItemFully(id) {
  const cart = readCart()
  cart.items = cart.items.filter(i => i.id !== id)
  if (cart.items.length === 0) cart.createdAt = null
  writeCart(cart)
}

export function clearCart() {
  writeCart({ items: [], createdAt: null })
}

export default {
  getCart,
  getItemCount,
  addToCart,
  removeFromCart,
  removeItemFully,
  clearCart
}
