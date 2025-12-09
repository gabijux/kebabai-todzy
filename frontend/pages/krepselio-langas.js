import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCart, getItemCount, removeFromCart, removeItemFully, clearCart } from '../utils/cart'

export default function KrepselioLangas() {
  const [cart, setCart] = useState({ items: [], createdAt: null })
  const [itemCount, setItemCount] = useState(0)
  const [kebabai, setKebabai] = useState([])

  const refreshLocalCart = () => {
    const c = getCart()
    setCart(c)
    setItemCount(getItemCount())
  }

  useEffect(() => {
    // 1) Fetch kebabai so we can attach names
    fetch('/api/kebabas')
      .then(res => res.json())
      .then(data => setKebabai(data))
      .catch(() => setKebabai([]))

    // 2) Sync with server if logged in
    const stored = localStorage.getItem('user')
    const parsed = stored ? JSON.parse(stored) : null
    const userId = parsed?.id ?? parsed?.Id ?? parsed?.userId ?? null

    if (userId) {
      fetch(`/api/cart/user/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.items) {
            // Convert server cart to local format (without names yet)
            const rawItems = data.items.map(i => ({
              id: i.kebabasId ?? i.KebabasId ?? i.KebabasID ?? i.Id,
              quantity: i.quantity ?? i.Quantity,
            }))

            // Attach kebab names + prices
            const enriched = rawItems.map(item => {
              const kebabas = kebabai.find(k => k.id === item.id)
              return {
                id: item.id,
                name: kebabas?.name ?? 'Nežinomas kebabas',
                price: kebabas?.price ?? null,
                quantity: item.quantity
              }
            })

            setCart({ items: enriched, createdAt: data.createdAt })
            setItemCount(enriched.reduce((s, it) => s + it.quantity, 0))
            return
          }

          // fallback
          refreshLocalCart()
        })
        .catch(() => refreshLocalCart())
    } else {
      refreshLocalCart()
    }
  }, [kebabai.length]) // updates once kebabai load

  const handleRemoveOne = (id) => {
    removeFromCart(id)

    const stored = localStorage.getItem('user')
    const parsed = stored ? JSON.parse(stored) : null
    const userId = parsed?.id ?? parsed?.Id ?? parsed?.userId ?? null

    if (userId) {
      fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserId: userId, KebabasId: id, RemoveAll: false })
      }).catch(err => console.error(err))
    }

    refreshLocalCart()
  }

  const handleRemoveAll = (id) => {
    removeItemFully(id)

    const stored = localStorage.getItem('user')
    const parsed = stored ? JSON.parse(stored) : null
    const userId = parsed?.id ?? parsed?.Id ?? parsed?.userId ?? null

    if (userId) {
      fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserId: userId, KebabasId: id, RemoveAll: true })
      }).catch(err => console.error(err))
    }

    refreshLocalCart()
  }

  const handleClear = () => {
    if (!confirm('Ar tikrai ištuštinti krepšelį?')) return

    clearCart()

    const stored = localStorage.getItem('user')
    const parsed = stored ? JSON.parse(stored) : null
    const userId = parsed?.id ?? parsed?.Id ?? parsed?.userId ?? null

    if (userId) {
      fetch(`/api/cart/clear/${userId}`, { method: 'POST' })
        .catch(err => console.error(err))
    }

    refreshLocalCart()
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Krepšelis</h1>

      <div style={{ marginBottom: 16 }}>
        <strong>Pridėta pirmą kartą:</strong> {cart.createdAt ? new Date(cart.createdAt).toLocaleString() : '—'}
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Prekių skaičius:</strong> {itemCount}
      </div>

      {cart.items.length === 0 && <p>Krepšelis tuščias.</p>}

      {cart.items.map(item => (
        <div key={item.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{item.name}</h3>
              {item.price != null && <div>kaina: €{item.price.toFixed(2)}</div>}
              <div>kiekis: {item.quantity}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleRemoveOne(item.id)} style={{ padding: '6px 10px' }}>- 1</button>
              <button onClick={() => handleRemoveAll(item.id)} style={{ padding: '6px 10px' }}>Ištrinti</button>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <button onClick={handleClear} style={{ marginRight: 12, padding: '8px 12px' }}>Išvalyti krepšelį</button>
        <Link href="/uzsakymo-langas" style={{ padding: '8px 12px', background: '#3498db', color: 'white', borderRadius: 4, textDecoration: 'none' }}>Sudaryti užsakymą</Link>
      </div>

      <p style={{ marginTop: 30 }}>
        <Link href="/">← Atgal į Pagrindinį langą</Link>
      </p>
    </main>
  )
}
