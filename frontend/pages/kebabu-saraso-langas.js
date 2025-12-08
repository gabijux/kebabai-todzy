import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function KebabuSarasoLangas() {
  const router = useRouter()
  const { id } = router.query

  const [kebabai, setKebabai] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
    fetchKebabai()
  }, [])

  const fetchKebabai = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/kebabas')
      if (!res.ok) throw new Error('Nepavyko užkrauti kebabų')
      const data = await res.json()
      setKebabai(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(kebabai.map(k => k.category))]

  const filteredKebabai = kebabai.filter(kebabas => {
    const matchesSearch =
      kebabas.name.toLowerCase().includes(filter.toLowerCase()) ||
      kebabas.description.toLowerCase().includes(filter.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || kebabas.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getSizeLabel = (size) => {
    if (size === null) return 'Nenustatyta'
    return size === 0 ? 'Mažas' : 'Didelis'
  }

  const isAdmin = user && (user.role === 1 || user.role === 'Admin')

  const handleDelete = async (id) => {
    if (!confirm("Ar tikrai norite ištrinti šį kebabą?")) return
    try {
      const res = await fetch(`/api/kebabas/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert("Kebabas ištrintas")
        fetchKebabai()
      } else alert("Nepavyko ištrinti")
    } catch (err) {
      console.error(err)
      alert("Klaida trinant")
    }
  }

  if (loading) return <main style={{ padding: 20 }}><p>Kraunama...</p></main>
  if (error) return <main style={{ padding: 20 }}><p style={{ color: 'red' }}>Klaida: {error}</p></main>

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <h1>Kebabų sąrašas</h1>

        {isAdmin && (
          <Link href="/kebabo-valdymo-langas" style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold',
            marginTop: 10
          }}>
            + Pridėti kebabą
          </Link>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <Link href="/" style={{ color: '#3498db', textDecoration: 'none' }}>← Atgal į Pagrindinį langą</Link>
      </div>

      {/* Filters */}
      <div style={{ margin: '20px 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Paieška..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', flexGrow: 1, minWidth: 200 }}
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'Visos kategorijos' : cat}</option>
          ))}
        </select>
      </div>

      {filteredKebabai.length === 0 ? (
        <p>Kebabų nerasta.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20
        }}>
          {filteredKebabai.map(k => (
            <div key={k.id} style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backgroundColor: '#fff',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ padding: 15 }}>
                <h3 style={{ marginBottom: 8 }}>{k.name} {k.spicy && <span title="Aštrus">🌶️</span>}</h3>
                <p style={{ fontSize: 14, color: '#555', minHeight: 40 }}>{k.description}</p>

                <div style={{ display: 'flex', gap: 6, margin: '10px 0', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#3498db', color: '#fff', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}>
                    {k.category}
                  </span>
                  <span style={{ backgroundColor: '#9b59b6', color: '#fff', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}>
                    {getSizeLabel(k.size)}
                  </span>
                </div>

                <p style={{ fontWeight: 'bold', fontSize: 16, color: '#e67e22' }}>€{k.price.toFixed(2)}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <Link href={`/kebabo-perziuros-langas?id=${k.id}`} style={{ color: '#3498db', fontWeight: 'bold' }}>Peržiūrėti</Link>

                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/kebabo-valdymo-langas?id=${k.id}`} style={{
                        color: 'white',
                        backgroundColor: '#f39c12',
                        padding: '5px 10px',
                        borderRadius: 6,
                        textDecoration: 'none',
                        fontSize: 12
                      }}>
                        Redaguoti
                      </Link>
                      <button onClick={() => handleDelete(k.id)} style={{
                        color: 'white',
                        backgroundColor: '#e74c3c',
                        padding: '5px 10px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12
                      }}>
                        Ištrinti
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}