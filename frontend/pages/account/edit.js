import Link from 'next/link'

export default function AccountEdit() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Paskyros redagavimo langas</h1>
      <p>Demo edit form goes here.</p>
      <p><Link href="/account">Back to Paskyros langas</Link></p>
    </main>
  )
}
