import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';

export function Shop() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [client, setClient] = useState(null);
  const [cardDetails, setCardDetails] = useState({});
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [clientCards, setClientCards] = useState([]);

  useEffect(() => {
    // Obtener la información del cliente al cargar el componente
    axios.get('http://localhost:8000/users/clients/')
      .then(response => {
        setClient(response.data[0]);
        fetchClientCards(response.data[0].id);
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

  const fetchClientCards = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:8000/manage/cards/?client=${clientId}`);
      setClientCards(response.data);
    } catch (error) {
      console.error('Error fetching client cards:', error);
    }
  };

  const handleReserve = async (bookId) => {
    try {
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

  const handleBuy = async (bookId, selectedCard) => {
    try {
      // Verificar si se ha cargado la información del cliente
      if (!client) {
        setAlertMessage('No se ha cargado la información del cliente.');
        setAlertVariant('danger');
        return;
      }

      // Verificar si el saldo de la tarjeta es suficiente
      const book = books.find(b => b.id === bookId);
      if (selectedCard.wallet < book.price) {
        setAlertMessage('El saldo de la tarjeta no es suficiente para realizar la compra.');
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
        // Actualizar el saldo de la tarjeta
        const newWallet = selectedCard.wallet - book.price;
        await axios.patch(`http://localhost:8000/manage/cards/${selectedCard.id}/`, { wallet: newWallet });

        setAlertMessage('Compra realizada con éxito');
        setAlertVariant('success');
        // Actualizar la tarjeta en el estado clientCards
        setClientCards(prevCards => prevCards.map(card => card.id === selectedCard.id ? { ...card, wallet: newWallet } : card));
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

  const handlePaymentSubmit = async (e, bookId, selectedCard) => {
    e.preventDefault();

    // Realizar la compra
    await handleBuy(bookId, selectedCard);
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
                    <div>
                      <select
                        value={cardDetails.selectedCard ? cardDetails.selectedCard.id : ''}
                        onChange={(e) => setCardDetails({ ...cardDetails, selectedCard: clientCards.find(card => card.id === parseInt(e.target.value)) })}
                      >
                        <option value="">Seleccione una tarjeta</option>
                        {clientCards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.name} (Saldo: ${card.wallet})
                          </option>
                        ))}
                      </select>
                      {cardDetails.selectedCard && (
                        <form onSubmit={(e) => handlePaymentSubmit(e, book.id, cardDetails.selectedCard)}>
                          <button type="submit" className="btn btn-primary">Comprar</button>
                        </form>
                      )}
                    </div>
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