import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function KebabiniuSarasoLangas() {
  const router = useRouter()
  const [kebabines, setKebabines] = useState([])
  const [filteredKebabines, setFilteredKebabines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  // Filter states
  const [nameFilter, setNameFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [minRating, setMinRating] = useState('')

  useEffect(() => {
    // Check user role
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }

    fetchKebabines()
  }, [])

  const fetchKebabines = () => {
    fetch('/api/kebabines')
      .then(res => {
        if (!res.ok) throw new Error('Nepavyko gauti duomenų')
        return res.json()
      })
      .then(data => {
        setKebabines(data)
        setFilteredKebabines(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    let result = kebabines

    if (nameFilter) {
      result = result.filter(k => k.name.toLowerCase().includes(nameFilter.toLowerCase()))
    }

    if (cityFilter) {
      result = result.filter(k => k.city.toLowerCase().includes(cityFilter.toLowerCase()))
    }

    if (minRating) {
      result = result.filter(k => k.rating >= parseFloat(minRating))
    }

    setFilteredKebabines(result)
  }, [nameFilter, cityFilter, minRating, kebabines])

  const handleDelete = async (id) => {
    if (!confirm("Ar tikrai norite ištrinti šią kebabinę?")) return

    try {
      const res = await fetch(`/api/kebabines/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert("Kebabinė ištrinta")
        fetchKebabines() // Refresh list
      } else {
        alert("Nepavyko ištrinti")
      }
    } catch (err) {
      console.error(err)
      alert("Klaida trinant")
    }
  }

  const containerStyle = {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 1000,
    margin: '0 auto'
  }

  const filterStyle = {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  }

  const inputStyle = {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc'
  }

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }

  const isAdmin = user && (user.role === 'Admin' || user.role === 1)

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Kebabinių sąrašas</h1>
        {isAdmin && (
          <Link href="/kebabines-valdymo-langas" style={{ 
            backgroundColor: '#2ecc71', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: 5, 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            + Pridėti kebabinę
          </Link>
        )}
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <Link href="/" style={{ color: '#3498db', textDecoration: 'none' }}>← Atgal į Pagrindinį langą</Link>
      </div>

      <div style={filterStyle}>
        <input 
          type="text" 
          placeholder="Pavadinimas..." 
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          style={inputStyle}
        />
        <input 
          type="text" 
          placeholder="Miestas..." 
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          style={inputStyle}
        />
        <input 
          type="number" 
          placeholder="Min. įvertinimas" 
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
          style={{ ...inputStyle, width: '150px' }}
          step="0.1"
          min="0"
          max="5"
        />
      </div>

      {loading && <p>Kraunama...</p>}
      {error && <p style={{ color: 'red' }}>Klaida: {error}</p>}

      {!loading && !error && (
        <div>
          <p>Rasta kebabinių: {filteredKebabines.length}</p>
          {filteredKebabines.map(kebabine => (
            <div key={kebabine.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{kebabine.name}</h3>
                <span style={{ 
                  backgroundColor: '#f1c40f', 
                  padding: '4px 8px', 
                  borderRadius: 4, 
                  fontWeight: 'bold' 
                }}>
                  ★ {kebabine.rating}
                </span>
              </div>
              <p style={{ margin: '5px 0' }}><strong>Miestas:</strong> {kebabine.city}</p>
              <p style={{ margin: '5px 0' }}><strong>Adresas:</strong> {kebabine.address}</p>
              <p style={{ margin: '5px 0' }}><strong>Darbo laikas:</strong> {kebabine.openingHours}</p>
              
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href={`/kebabines-informacijos-langas?id=${kebabine.id}`} style={{ color: '#3498db' }}>
                  Peržiūrėti detaliau
                </Link>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link href={`/kebabines-valdymo-langas?id=${kebabine.id}`} style={{ 
                      color: 'white', 
                      backgroundColor: '#f39c12', 
                      padding: '5px 10px', 
                      borderRadius: 4, 
                      textDecoration: 'none',
                      fontSize: 14
                    }}>
                      Redaguoti
                    </Link>
                    <button onClick={() => handleDelete(kebabine.id)} style={{ 
                      color: 'white', 
                      backgroundColor: '#e74c3c', 
                      padding: '5px 10px', 
                      borderRadius: 4, 
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14
                    }}>
                      Ištrinti
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredKebabines.length === 0 && (
            <p>Pagal pasirinktus filtrus kebabinių nerasta.</p>
          )}
        </div>
      )}
    </div>
  )
}
