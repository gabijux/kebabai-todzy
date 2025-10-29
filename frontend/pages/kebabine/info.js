import { useRouter } from 'next/router'
import Link from 'next/link'

export default function KebabInfo() {
  const router = useRouter()
  const { id } = router.query

  return (
    <main style={{ padding: 20 }}>
      <h1>Kebabinės informacijos langas</h1>
      <p><Link href="/kebabine/list">Back to list</Link></p>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
