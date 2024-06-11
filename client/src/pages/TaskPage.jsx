import React, { useState, useEffect } from "react";
import axios from "axios";
import backendURL from "../config"; // Importa la variable backendURL desde el archivo config.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap

export function TaskPage() {
  // Estado para almacenar la lista de libros
  const [books, setBooks] = useState([]);
  
  // Estado para controlar el índice del libro actual
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Función para desplazarse al libro anterior
  const prevBook = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));
  };
  
  // Función para desplazarse al siguiente libro
  const nextBook = () => {
    setCurrentIndex((prevIndex) => (prevIndex === books.length - 1 ? 0 : prevIndex + 1));
  };
  
  // Función para cargar los libros desde el servidor
  useEffect(() => {
    axios.get(`${backendURL}/manage/books/`)
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []); // Ejecutar solo una vez al montar el componente
  
  return (
    <div className="container content">
      <h1>¡Bienvenido a nuestro sitio web!</h1>
      <h2>Aquí nuestras últimas novedades disponibles para ti</h2>
      
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {books.map((book, index) => (
            <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
              <img src={book.image} className="d-block w-100" alt="imagen del libro" />
              <div className="carousel-caption d-none d-md-block" style={{ color: "black", bottom: "20px", left: "0", right: "0", backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "20px" }}>
                <h5>{book.title}</h5>
                <p>Autor: {book.author}</p>
                <p>Género: {book.gender}</p>
                <p>Precio: ${book.price}</p>
                <p>Condición: {book.condition}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" onClick={prevBook}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" onClick={nextBook}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      
      <div className="section">
        <h3>Lorem</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, corporis, consectetur officia maiores cupiditate at quidem accusantium ratione molestiae, labore ad commodi ipsum. Autem earum ex aspernatur natus accusantium sunt.</p>
      </div>
      
      <div className="section">
        <h3>Contactanos</h3>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio aut magnam aliquid, sequi repellat nostrum corporis earum quaerat numquam aspernatur est quos beatae ratione facere exercitationem velit accusamus expedita dolor.</p>
      </div>
    </div>
  );
}
