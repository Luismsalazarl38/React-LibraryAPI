import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import { Alert } from 'react-bootstrap'; // Importar el componente de alerta de Bootstrap

export function Shop() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [client, setClient] = useState(null); // Agregamos el estado para el cliente
  const [cardDetails, setCardDetails] = useState({}); // Estado para almacenar detalles de la tarjeta
  const [selectedBookId, setSelectedBookId] = useState(null); // Estado para controlar qué tarjeta está seleccionada
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de alerta
  const [alertVariant, setAlertVariant] = useState(""); // Estado para el tipo de alerta (success, danger, etc.)

  useEffect(() => {
    // Obtener la información del cliente al cargar el componente
    axios.get('http://localhost:8000/users/clients/')
      .then(response => {
        setClient(response.data[0]); // Suponiendo que solo hay un cliente y lo guardamos en el estado
      })
      .catch(error => {
        console.error('Error fetching client:', error);
      });

    // Obtener la lista de libros al cargar el componente
    axios.get('http://localhost:8000/manage/books/')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  const handleReserve = async (bookId) => {
    try {
      // Realizar la solicitud POST al endpoint de reservas
      const response = await axios.post('http://localhost:8000/manage/reservations/', {
        book: bookId,
        client: client.id,
        expired: false,
        date: new Date().toISOString()
      });
  
      if (response.status === 201) {
        setAlertMessage('Reserva realizada con éxito');
        setAlertVariant('success');
      } else {
        setAlertMessage('Error al realizar la reserva');
        setAlertVariant('danger');
      }
    } catch (error) {
      setAlertMessage('Error al realizar la reserva');
      setAlertVariant('danger');
      console.error('Error al realizar la reserva:', error);
    }
  };
  

  const handleBuy = async (bookId) => { // <-- Agrega bookId como argumento
    try {
      // Verificar si se ha cargado la información del cliente
      if (!client) {
        setAlertMessage('No se ha cargado la información del cliente.');
        setAlertVariant('danger');
        return;
      }

      // Realizar la solicitud POST al endpoint de ventas
      const response = await axios.post('http://localhost:8000/manage/sales/', {
        book: bookId,
        client: client.id,
        date: new Date().toISOString(),
        delivered: false,
        returned: false
      });

      if (response.status === 201) {
        setAlertMessage('Compra realizada con éxito');
        setAlertVariant('success');
      } else {
        setAlertMessage('Error al realizar la compra');
        setAlertVariant('danger');
      }
    } catch (error) {
      setAlertMessage('Error al realizar la compra');
      setAlertVariant('danger');
      console.error('Error al realizar la compra:', error);
    }
  };

  const handlePaymentSubmit = async (e, bookId) => {
    e.preventDefault();
  
    // Validar el número de tarjeta
    if (cardDetails.cardNumber.length !== 13 || isNaN(cardDetails.cardNumber)) {
      setAlertMessage('El número de tarjeta debe ser de 13 dígitos y solo números.');
      setAlertVariant('danger');
      return;
    }
  
    // Validar el mes de expiración
    const expiryMonth = parseInt(cardDetails.expiryMonth);
    if (expiryMonth < 1 || expiryMonth > 12 || isNaN(expiryMonth)) {
      setAlertMessage('El mes de expiración debe ser un número entre 1 y 12.');
      setAlertVariant('danger');
      return;
    }
  
    // Validar el año de expiración
    const currentYear = new Date().getFullYear();
    const expiryYear = parseInt(cardDetails.expiryYear);
    if (expiryYear <= currentYear || isNaN(expiryYear)) {
      setAlertMessage('El año de expiración debe ser un año superior al actual.');
      setAlertVariant('danger');
      return;
    }
  
    // Validar el código de seguridad
    if (cardDetails.securityCode.length !== 3 || isNaN(cardDetails.securityCode)) {
      setAlertMessage('El código de seguridad debe ser un número de 3 dígitos.');
      setAlertVariant('danger');
      return;
    }
  
    // Si pasa todas las validaciones, realizar la compra
    await handleBuy(bookId);
  };
  

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container content">
      <h1 className="mt-5 mb-3">¡Bienvenido a nuestra tienda!</h1>
      <h2 className="mb-4">Explora nuestras últimas novedades</h2>
      
      <div className="mb-3 row">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mostrar la alerta si hay un mensaje */}
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage("")} dismissible>
          {alertMessage}
        </Alert>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredBooks.map((book, index) => (
          <div key={index} className="col">
            <div className="card h-100">
              <img src={book.image} className="card-img-top" alt="imagen del libro" />
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">Autor: {book.author}</p>
                <p className="card-text">Género: {book.gender}</p>
                <p className="card-text">Precio: ${book.price}</p>
                <p className="card-text">Condición: {book.condition}</p>
              </div>
              <div className="card-footer">
                <div className="d-grid gap-2">
                  {/* Mostrar el formulario de la tarjeta solo en la tarjeta seleccionada */}
                  {selectedBookId === book.id && (
                    <form onSubmit={(e) => handlePaymentSubmit(e, book.id)}>
                      <input type="text" placeholder="Número de tarjeta" value={cardDetails.cardNumber || ''} onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })} required />
                      <input type="text" placeholder="Mes de expiración" value={cardDetails.expiryMonth || ''} onChange={(e) => setCardDetails({ ...cardDetails, expiryMonth: e.target.value })} required />
                      <input type="text" placeholder="Año de expiración" value={cardDetails.expiryYear || ''} onChange={(e) => setCardDetails({ ...cardDetails, expiryYear: e.target.value })} required />
                      <input type="text" placeholder="Código de seguridad" value={cardDetails.securityCode || ''} onChange={(e) => setCardDetails({ ...cardDetails, securityCode: e.target.value })} required />
                      <button type="submit" className="btn btn-primary">Comprar</button>
                    </form>
                  )}
                  {/* Mostrar el botón Comprar y cambiar el estado de selectedBookId cuando se haga clic */}
                  <button className="btn btn-primary" type="button" onClick={() => setSelectedBookId(book.id)}>Comprar</button>
                  <button className="btn btn-secondary" type="button" onClick={() => handleReserve(book.id)}>Reservar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
