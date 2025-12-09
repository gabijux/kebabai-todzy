import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function UzsakymuPerziurosLangas() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      setLoading(false)
      return
    }

    const u = JSON.parse(stored)
    setUser(u)

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user/${u.id}`)
        if (!res.ok) {
          throw new Error('Nepavyko gauti užsakymų')
        }
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error(err)
        setError('Nepavyko gauti užsakymų')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>Užsakymų peržiūros langas</h1>

      {!user && !loading && (
        <p>Norėdami matyti užsakymus, prisijunkite prie sistemos.</p>
      )}

      {loading && <p>Kraunama...</p>}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {user && !loading && !error && (
        <>
          {orders.length === 0 ? (
            <p>Užsakymų dar neturite.</p>
          ) : (
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: 20,
              borderRadius: 16,
              maxWidth: 800
            }}>
              <h2>Jūsų užsakymai</h2>
              <table style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px 4px' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px' }}>Data</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px' }}>Suma (€)</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px' }}>Būsena</th>
                    <th style={{ textAlign: 'left', padding: '8px 4px' }}>Veiksmai</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ padding: '6px 4px' }}>{order.id}</td>
                      <td style={{ padding: '6px 4px' }}>
                        {new Date(order.orderDate).toLocaleString()}
                      </td>
                      <td style={{ padding: '6px 4px' }}>{order.amount.toFixed(2)}</td>
                      <td style={{ padding: '6px 4px' }}>{order.status}</td>
                      <td style={{ padding: '6px 4px' }}>
                        <button
                          onClick={() => router.push(`/uzsakymo-langas?id=${order.id}`)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#3498db',
                            color: '#fff'
                          }}
                        >
                          Peržiūrėti
                        </button>
                        <button
                          onClick={async () => {
                            // fetch order details (including items) and populate local cart, then redirect to order review
                            try {
                              // support both Id and id on order object
                              const idValue = order.id ?? order.Id
                              const res = await fetch(`/api/orders/${idValue}`)
                              if (!res.ok) throw new Error('Nepavyko gauti užsakymo')
                              const data = await res.json()

                              // normalize items array (case-insensitive property access)
                              const rawItems = data.items ?? data.Items ?? []
                              const items = rawItems.map(i => {
                                const keb = i.kebabas ?? i.Kebabas ?? i.Kebabas ?? i.Kebabas ?? null
                                const kebId = i.kebabasId ?? i.KebabasId ?? (keb ? (keb.id ?? keb.Id) : null)
                                const name = keb?.name ?? keb?.Name ?? i.name ?? i.Name ?? 'Kebabas'
                                const price = keb?.price ?? keb?.Price ?? i.price ?? i.Price ?? null
                                const quantity = i.quantity ?? i.Quantity ?? 1
                                return { id: kebId, name, price, quantity }
                              })

                              const cart = { items, createdAt: new Date().toISOString() }
                              localStorage.setItem('cart', JSON.stringify(cart))

                              // if user is logged in, try to replace server-side cart too so the cart page won't override local cart with an empty server cart
                              const storedUser = localStorage.getItem('user')
                              const parsedUser = storedUser ? JSON.parse(storedUser) : null
                              const userId = parsedUser?.id ?? parsedUser?.Id ?? parsedUser?.userId ?? null
                              if (userId) {
                                try {
                                  await fetch('/api/cart/replace', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ UserId: userId, Items: items.map(i => ({ KebabasId: i.id, Quantity: i.quantity })) })
                                  })
                                } catch (e) {
                                  console.error('Failed to replace server cart', e)
                                }
                              }

                              // Navigate to order review page
                              router.push('/uzsakymo-langas')
                            } catch (err) {
                              console.error(err)
                              alert('Nepavyko užsakyti vėl')
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#2ecc71',
                            color: '#fff',
                            marginLeft: 8
                          }}
                        >
                          Užsisakyti vėl
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <p style={{ marginTop: 30 }}><Link href="/">← Atgal į Pagrindinį langą</Link></p>
    </main>
  )
}
