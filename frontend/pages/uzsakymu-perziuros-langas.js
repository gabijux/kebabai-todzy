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
