import Link from 'next/link'

export default function ChangePassword() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Slaptažodžio keitimo langas</h1>
      <p>Demo change password form.</p>
      <p><Link href="/account">Back to Paskyros langas</Link></p>
    </main>
  )
}
