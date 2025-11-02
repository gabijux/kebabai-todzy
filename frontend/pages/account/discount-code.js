import Link from 'next/link'

export default function GetCode() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Nuolaidos kodo generavimo langas</h1>
      <p>Demo skaitiklis = 5</p>
      <p><Link href="/account">Back to Paskyros langas</Link></p>
    </main>
  )
}
