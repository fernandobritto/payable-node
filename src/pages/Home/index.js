import React, { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Home() {
  const [trips, setTrips] = useState([])
  useEffect(() => {
    async function loadApi(){
      const response = await api.get('trips')
      setTrips(response.data)

    }

    loadApi()

  }, [])

  return (
    <div>
      <div className="box">
          {trips.map(trip =>(
            <li key={trip.id}>
              <strong>{trip.title}</strong>
          <span>Status: {trip.status ? 'Disponoval':'Indisponivel'}</span>
            </li>
          ))}
      </div>
    </div>
  )
}
