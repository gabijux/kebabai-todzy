import Link from 'next/link'

export default function DeleteAccount() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Paskyros šalinimo langas</h1>
      <p>Demo: you're about to delete your account.</p>
      <p><Link href="/account">Back to Paskyros langas</Link></p>
    </main>
  )
}
