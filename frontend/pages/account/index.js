import Link from 'next/link'

export default function Account() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Paskyros langas</h1>
      <ul>
        <li><Link href="/account/edit">Redaguoti paskyrą</Link></li>
        <li><Link href="/account/change-password">Slaptažodžio keitimas</Link></li>
        <li><Link href="/account/delete">Paskyros šalinimas</Link></li>
      </ul>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
