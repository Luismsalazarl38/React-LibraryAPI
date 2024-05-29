import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [sales, setSales] = useState([]);
  const [isSalesCollapsed, setIsSalesCollapsed] = useState(true);
  const [isReservationsCollapsed, setIsReservationsCollapsed] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/manage/reservations/')
      .then(response => {
        setReservations(response.data);
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
      });

    axios.get('http://localhost:8000/manage/sales/')
      .then(response => {
        setSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching sales:', error);
      });
  }, []);

  const handleReturn = async (saleId) => {
    try {
      console.log(`Iniciando devolución para la venta con ID: ${saleId}`);
      
      setTimeout(async () => {
        await axios.delete(`http://localhost:8000/manage/sales/${saleId}/`);
        setSales(prevSales => prevSales.filter(sale => sale.id !== saleId));
        console.log(`Venta con ID ${saleId} borrada después de la devolución`);
      }, 80000);
    } catch (error) {
      console.error('Error handling return:', error);
    }
  };

  const handleDeleteSale = async (saleId) => {
    try {
      await axios.delete(`http://localhost:8000/manage/sales/${saleId}/`);
      setSales(prevSales => prevSales.filter(sale => sale.id !== saleId));
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8000/manage/reservations/${reservationId}/`);
      setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const toggleSalesCollapse = () => {
    setIsSalesCollapsed(!isSalesCollapsed);
  };

  const toggleReservationsCollapse = () => {
    setIsReservationsCollapsed(!isReservationsCollapsed);
  };

  return (
    <div className="container">
      <br /><br /><br /><br /><br /><br />
      <h1>Gestion de Compras y Reservas</h1>
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-link" onClick={toggleSalesCollapse}>
            <h2 className="mb-0">Mis Compras</h2>
          </button>
          {!isSalesCollapsed && (
            <div className="row">
              {sales.map(sale => (
                <div key={sale.id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Sale ID: {sale.id}</h5>
                      <p className="card-text">Book ID: {sale.book}</p>
                      <p className="card-text">Client ID: {sale.client}</p>
                      <p className="card-text">Date: {new Date(sale.date).toLocaleString()}</p>
                      <button className="btn btn-primary m-2" onClick={() => handleReturn(sale.id)}>Iniciar Devolución</button>
                      <button className="btn btn-danger m-2" onClick={() => handleDeleteSale(sale.id)}>Borrar Venta</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-md-12 mt-4">
          <button className="btn btn-link" onClick={toggleReservationsCollapse}>
            <h2 className="mb-0">Mis Reservas</h2>
          </button>
          {!isReservationsCollapsed && (
            <div className="row">
              {reservations.map(reservation => (
                <div key={reservation.id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Reservation ID: {reservation.id}</h5>
                      <p className="card-text">Book ID: {reservation.book}</p>
                      <p className="card-text">Client ID: {reservation.client}</p>
                      <p className="card-text">Expired: {reservation.expired ? 'Yes' : 'No'}</p>
                      <p className="card-text">Date: {new Date(reservation.date).toLocaleString()}</p>
                      <button className="btn btn-danger" onClick={() => handleDeleteReservation(reservation.id)}>Borrar Reserva</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reservations;
