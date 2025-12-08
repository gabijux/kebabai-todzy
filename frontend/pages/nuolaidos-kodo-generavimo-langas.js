import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NuolaidosKodoGeneravimoLangas() {
  const [user, setUser] = useState(null)
  const [discountCode, setDiscountCode] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)

      if (u.OrdersCount < 5) {
        setMessage({ type: 'error', text: 'Nuolaidos kodą galite generuoti tik po 5 užsakymų.' })
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!user) return
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/discounts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || "Nepavyko sugeneruoti." })
        setLoading(false)
        return
      }

      setDiscountCode(data.code)
      setMessage({ type: 'success', text: data.message })

      // Update localStorage to reset ordersCount
      const updatedUser = { ...user, ordersCount: 0 }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Serverio klaida.' })
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Nuolaidos kodo generavimo langas</h1>
        <p>Nėra prisijungusio naudotojo.</p>
        <Link href="/paskyros-langas">← Atgal į Paskyros langą</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Nuolaidos kodo generavimo langas</h1>

      {message && (
        <div style={{
          background: message.type === 'success' ? '#14532d' : '#7f1d1d',
          color: 'white',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20
        }}>
          {message.text}
        </div>
      )}

      {discountCode ? (
        <p>Jūsų nuolaidos kodas: <strong>{discountCode}</strong></p>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading || user.ordersCount < 5}
          style={{
            padding: '10px 20px',
            backgroundColor: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          {loading ? "Generuojama..." : "Generuoti nuolaidos kodą"}
        </button>
      )}

      <p style={{ marginTop: 30 }}><Link href="/paskyros-langas">← Atgal į Paskyros langą</Link></p>
    </main>
  )
}
