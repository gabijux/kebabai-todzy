import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function UzsakymoLangas() {
  const router = useRouter()
  const { id } = router.query

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (!res.ok) {
          throw new Error('Užsakymas nerastas')
        }
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        console.error(err)
        setError('Nepavyko gauti užsakymo informacijos.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  return (
    <main style={{ padding: 20 }}>
      <h1>Užsakymo langas</h1>

      {loading && <p>Kraunama...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {order && !loading && !error && (
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: 20,
          borderRadius: 16,
          maxWidth: 500,
          marginBottom: 20
        }}>
          <p><strong>Užsakymo ID:</strong> {order.id}</p>
          <p><strong>Data:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Suma:</strong> {order.amount.toFixed(2)} €</p>
          <p><strong>Būsena:</strong> {order.status}</p>
        </div>
      )}

      <p style={{ marginTop: 30 }}>
        <Link href="/uzsakymu-perziuros-langas">← Atgal į Užsakymų peržiūros langą</Link>
        {' | '}
        <Link href="/krepselio-langas">← Atgal į Krepšelio langą</Link>
      </p>
    </main>
  )
}
