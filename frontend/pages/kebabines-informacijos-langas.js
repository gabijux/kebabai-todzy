import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function KebabinesInformacijosLangas() {
  const router = useRouter()
  const { id } = router.query
  
  const [kebabine, setKebabine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    fetch(`/api/kebabines/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Kebabinė nerasta')
        return res.json()
      })
      .then(data => {
        setKebabine(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  const containerStyle = {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 800,
    margin: '0 auto'
  }

  const infoCardStyle = {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 20,
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: 20
  }

  const labelStyle = {
    fontWeight: 'bold',
    color: '#555',
    width: 150,
    display: 'inline-block'
  }

  const rowStyle = {
    marginBottom: 10,
    borderBottom: '1px solid #eee',
    paddingBottom: 5
  }

  if (loading) return <div style={containerStyle}>Kraunama...</div>
  if (error) return <div style={containerStyle}><p style={{color: 'red'}}>Klaida: {error}</p><Link href="/kebabiniu-saraso-langas">Grįžti į sąrašą</Link></div>
  if (!kebabine) return null

  return (
    <div style={containerStyle}>
      <h1>{kebabine.name}</h1>
      
      <div style={infoCardStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Įvertinimas:</span>
          <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>★ {kebabine.rating}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Miestas:</span>
          <span>{kebabine.city}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Adresas:</span>
          <span>{kebabine.address}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Darbo laikas:</span>
          <span>{kebabine.openingHours}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Telefonas:</span>
          <span>{kebabine.phoneNumber}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>El. paštas:</span>
          <span>{kebabine.email}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Darbuotojų sk.:</span>
          <span>{kebabine.employeeCount}</span>
        </div>
      </div>

      <h2>Vieta žemėlapyje</h2>
      <div style={{ width: '100%', height: 400, border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={`https://maps.google.com/maps?q=${kebabine.xCoordinate},${kebabine.yCoordinate}&z=15&output=embed`}
        >
        </iframe>
      </div>

      <p style={{ marginTop: 30 }}>
        <Link href="/kebabiniu-saraso-langas" style={{ color: '#3498db', textDecoration: 'none' }}>
          ← Atgal į Kebabinių sąrašą
        </Link>
      </p>
    </div>
  )
}
