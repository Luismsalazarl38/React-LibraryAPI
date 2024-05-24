import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap

export function Shop() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [client, setClient] = useState(null); // Agregamos el estado para el cliente
  
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

  const handleReserve = async (bookId) => { // Modifica el argumento para recibir el ID del libro
    try {
      // Verificar si se ha cargado la información del cliente
      if (!client) {
        console.error('No se ha cargado la información del cliente.');
        return;
      }

      // Obtener información detallada del cliente
      const clientResponse = await axios.get(`http://localhost:8000/users/clients/${client.id}`);
      const clientId = clientResponse.data.id;

      // Crear la reserva utilizando los IDs del libro y del cliente
      const response = await axios.post('http://localhost:8000/manage/reservations/', {
        book: bookId,
        client: clientId,
        expired: false,
        date: new Date().toISOString()
      });

      if (response.status === 201) {
        console.log('Reserva creada con éxito');
      } else {
        console.log('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error al crear la reserva:', error);
    }
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
                  <button className="btn btn-primary" type="button">Comprar</button>
                  <button className="btn btn-secondary" type="button" onClick={() => handleReserve(book.id)}>Reservar</button>
                  {/* Reemplaza 'DNI_DEL_CLIENTE' con el DNI real del cliente */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
