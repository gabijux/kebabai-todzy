import Link from 'next/link'

export default function AddKebab() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Kebabo pridėjimo langas (admin)</h1>
      <p>Demo form would go here.</p>
      <p><Link href="/admin/kebab-management">Back to management</Link></p>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
