import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ArtimiausiosKebabinesLangas() {
  const [kebabines, setKebabines] = useState([])
  const [nearestKebabine, setNearestKebabine] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Haversine formula to calculate distance between two points
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  useEffect(() => {
    // 1. Fetch kebabines
    fetch('/api/kebabines')
      .then(res => {
        if (!res.ok) throw new Error('Nepavyko gauti kebabinių sąrašo')
        return res.json()
      })
      .then(data => {
        setKebabines(data)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // 2. Get User Location if kebabines are loaded
    if (kebabines.length > 0) {
      if (!navigator.geolocation) {
        setError("Jūsų naršyklė nepalaiko geolokacijos.")
        setLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLon = position.coords.longitude
          setUserLocation({ lat: userLat, lon: userLon })

          // 3. Find nearest
          let minDistance = Infinity
          let nearest = null

          kebabines.forEach(k => {
            const dist = getDistanceFromLatLonInKm(userLat, userLon, k.xCoordinate, k.yCoordinate)
            if (dist < minDistance) {
              minDistance = dist
              nearest = { ...k, distance: dist }
            }
          })

          setNearestKebabine(nearest)
          setLoading(false)
        },
        (err) => {
          console.error(err)
          setPermissionDenied(true)
          setLoading(false)
        }
      )
    }
  }, [kebabines])

  const containerStyle = {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center'
  }

  return (
    <div style={containerStyle}>
      <h1>Artimiausia kebabinė</h1>

      {loading && <p>Ieškoma artimiausios kebabinės...</p>}
      
      {error && <p style={{ color: 'red' }}>Klaida: {error}</p>}

      {permissionDenied && (
        <div style={{ color: 'orange', border: '1px solid orange', padding: 20, borderRadius: 8 }}>
          <p>Nepavyko nustatyti jūsų vietos. Prašome leisti naršyklei pasiekti jūsų vietovę.</p>
        </div>
      )}

      {nearestKebabine && (
        <div>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: 8, 
            padding: 20, 
            backgroundColor: '#f9f9f9',
            marginBottom: 20,
            textAlign: 'left'
          }}>
            <h2 style={{ marginTop: 0 }}>{nearestKebabine.name}</h2>
            <p><strong>Atstumas:</strong> {nearestKebabine.distance.toFixed(2)} km</p>
            <p><strong>Adresas:</strong> {nearestKebabine.address}, {nearestKebabine.city}</p>
            <p><strong>Darbo laikas:</strong> {nearestKebabine.openingHours}</p>
            <p><strong>Įvertinimas:</strong> <span style={{ color: '#f1c40f' }}>★ {nearestKebabine.rating}</span></p>
            
            <Link href={`/kebabines-informacijos-langas?id=${nearestKebabine.id}`} style={{ color: '#3498db', fontWeight: 'bold' }}>
              Peržiūrėti detaliau
            </Link>
          </div>

          <h3>Žemėlapis</h3>
          <div style={{ width: '100%', height: 400, border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src={`https://maps.google.com/maps?q=${nearestKebabine.xCoordinate},${nearestKebabine.yCoordinate}&z=15&output=embed`}
            >
            </iframe>
          </div>
        </div>
      )}

      <p style={{ marginTop: 30 }}>
        <Link href="/" style={{ color: '#3498db', textDecoration: 'none' }}>← Atgal į Pagrindinį langą</Link>
      </p>
    </div>
  )
}
