import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reservations() {
  // Estado para almacenar las reservas
  const [reservations, setReservations] = useState([]);

  // Función para cargar las reservas desde el backend
  useEffect(() => {
    // Realiza una solicitud GET al endpoint de reservas
    axios.get('http://localhost:8000/manage/reservations/')
      .then(response => {
        // Almacena los datos de las reservas en el estado
        setReservations(response.data);
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
      });
  }, []); // Se ejecuta solo una vez al cargar el componente

  return (
      <div className="container">
        <br /><br /><br /><br /><br /><br />
      <h1>Reservations</h1>
      <div className="row">
        {reservations.map(reservation => (
          <div key={reservation.id} className="col-md-4 mb-4">
            <div className="card">
              {/* Agrega aquí la lógica para mostrar la imagen del libro */}
              <div className="card-body">
                <h5 className="card-title">Reservation ID: {reservation.id}</h5>
                <p className="card-text">Book ID: {reservation.book}</p>
                <p className="card-text">Client ID: {reservation.client}</p>
                <p className="card-text">Expired: {reservation.expired ? 'Yes' : 'No'}</p>
                <p className="card-text">Date: {new Date(reservation.date).toLocaleString()}</p>
                {/* Agrega aquí el botón de acción, si es necesario */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reservations;
