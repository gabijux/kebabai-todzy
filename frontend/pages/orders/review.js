import Link from 'next/link'

export default function OrdersReview() {
  const sample = [
    { id: 101, total: '8.50€' },
    { id: 102, total: '12.00€' }
  ]

  return (
    <main style={{ padding: 20 }}>
      <h1>Užsakymų peržiūros langas</h1>
      <ul>
        {sample.map(o => <li key={o.id}>Order #{o.id} — {o.total}</li>)}
      </ul>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
