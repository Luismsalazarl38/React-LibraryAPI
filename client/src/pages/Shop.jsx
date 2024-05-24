import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap

export function Shop() {
  // Estado para almacenar la lista de libros
  const [books, setBooks] = useState([]);
  // Estado para almacenar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Función para cargar los libros desde el servidor
  useEffect(() => {
    axios.get('http://localhost:8000/manage/books/')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []); // Ejecutar solo una vez al montar el componente
  
  // Función para filtrar libros según el término de búsqueda
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
      
      {/* Campo de búsqueda */}
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
                  <button className="btn btn-secondary" type="button">Reservar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
