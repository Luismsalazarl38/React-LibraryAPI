import React, { useState, useEffect } from "react";
import axios from "axios";

export function AdminBooks() {
  // Estado para almacenar la lista de libros
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    store: '',
    title: '',
    author: '',
    pubYear: '',
    gender: '',
    pages: '',
    editorial: '',
    issbn: '',
    language: '',
    condition: '',
    price: '',
    pubDate: ''
  });
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario
  const [newBookData, setNewBookData] = useState({
    store: '', // Agregar el campo store
    title: '',
    author: '',
    pubYear: '',
    gender: '',
    pages: '',
    editorial: '',
    issbn: '',
    language: '',
    condition: '',
    price: '',
    pubDate: '',
    image: null // Agregar el campo image
  });

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value !== undefined ? value : '' });
  };

  const handleNewBookChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
      setNewBookData({ ...newBookData, [name]: files[0] });
    } else {
      setNewBookData({ ...newBookData, [name]: value !== undefined ? value : '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        title: formData.title,
        author: formData.author,
        pubYear: formData.pubYear,
        gender: formData.gender,
        pages: formData.pages,
        editorial: formData.editorial,
        issbn: formData.issbn,
        language: formData.language,
        condition: formData.condition,
        price: formData.price
      };
      const response = await axios.patch(`http://localhost:8000/manage/books/${formData.id}/`, userData);
      if (response) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleNewBookSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('store', newBookData.store);
      formData.append('title', newBookData.title);
      formData.append('author', newBookData.author);
      formData.append('pubYear', newBookData.pubYear);
      formData.append('gender', newBookData.gender);
      formData.append('pages', newBookData.pages);
      formData.append('editorial', newBookData.editorial);
      formData.append('issbn', newBookData.issbn);
      formData.append('language', newBookData.language);
      formData.append('pubDate', newBookData.pubDate);
      formData.append('condition', newBookData.condition);
      formData.append('price', newBookData.price);
      if (newBookData.image) {
        formData.append('image', newBookData.image);
      }

      const response = await axios.post('http://localhost:8000/manage/books/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        window.location.reload();
      } else {
      }
    } catch (error) {
      console.error('Error al crear el nuevo libro:', error);
    }
  };

  // Función para cargar los libros desde el servidor
  useEffect(() => {
    axios.get('http://localhost:8000/manage/books/')
      .then(response => {
        setBooks(response.data);
        const currentBook = response.data[currentIndex];
        setFormData({
          id: currentBook.id,
          store: currentBook.store,
          title: currentBook.title,
          author: currentBook.author,
          pubYear: currentBook.pubYear,
          gender: currentBook.gender,
          pages: currentBook.pages,
          editorial: currentBook.editorial,
          issbn: currentBook.issbn,
          language: currentBook.language,
          condition: currentBook.condition,
          price: currentBook.price
        });
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, [currentIndex]); // Ejecutar cuando el currentIndex cambie

  return (
    <div className="container content">
      {/* Encabezado de la página */}
      <h1>Manejo de Libros</h1>
            
      {/* Botón para agregar un nuevo libro */}
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Agregar un nuevo libro'}
      </button>

      {/* Mostrar el formulario de creación si showForm es true */}
      {showForm && (
        <form onSubmit={handleNewBookSubmit}>
          <div className="mb-3">
            <label className="form-label">Tienda:</label>
            <input
              type="text"
              className="form-control"
              name="store"
              value={newBookData.store}
              onChange={handleNewBookChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Título:</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={newBookData.title}
              onChange={handleNewBookChange}
            />
          </div>
        <div className="mb-3">
          <label className="form-label">Autor:</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={newBookData.author}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Año de Publicación:</label>
          <input
            type="text"
            className="form-control"
            name="pubYear"
            value={newBookData.pubYear}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Género:</label>
          <input
            type="text"
            className="form-control"
            name="gender"
            value={newBookData.gender}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Páginas:</label>
          <input
            type="text"
            className="form-control"
            name="pages"
            value={newBookData.pages}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Editorial:</label>
          <input
            type="text"
            className="form-control"
            name="editorial"
            value={newBookData.editorial}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ISSBN:</label>
          <input
            type="text"
            className="form-control"
            name="issbn"
            value={newBookData.issbn}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Idioma:</label>
          <input
            type="text"
            className="form-control"
            name="language"
            value={newBookData.language}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Publicación:</label>
          <input
            type="text"
            className="form-control"
            name="pubDate"
            value={newBookData.pubDate}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Condición:</label>
          <input
            type="text"
            className="form-control"
            name="condition"
            value={newBookData.condition}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio:</label>
          <input
            type="text"
            className="form-control"
            name="price"
            value={newBookData.price}
            onChange={handleNewBookChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen:</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleNewBookChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear nuevo libro
        </button>
      </form>
      
      )}

      {/* Contenido principal */}
      <div className="slider">
        {/* Botón para desplazarse al libro anterior */}
        <button className="button" onClick={prevBook}>&#10094;</button>

        {/* Detalles del libro actual */}
        <div className="book-details">
          {/* Mostrar la imagen del libro si existe */}
          <img className="newsImage" src={books[currentIndex]?.image} alt="imagen del libro" />
          <h2>{books[currentIndex]?.title}</h2>
          <p>ID Inventario: {books[currentIndex]?.id}</p>
          <p>Tienda: {books[currentIndex]?.store}</p>
          <p>Título: {books[currentIndex]?.title}</p>
          <p>Autor: {books[currentIndex]?.author}</p>
          <p>Género: {books[currentIndex]?.gender}</p>
          <p>Precio: ${books[currentIndex]?.price}</p>
          <p>Año de Publicación: {books[currentIndex]?.pubYear}</p>
          <p>Fecha de Publicación: {books[currentIndex]?.pubDate}</p>
          <p>Páginas: {books[currentIndex]?.pages}</p>
          <p>Editorial: {books[currentIndex]?.editorial}</p>
          <p>ISSBN: {books[currentIndex]?.issbn}</p>
          <p>Idioma: {books[currentIndex]?.language}</p>
          <p>Condición: {books[currentIndex]?.condition}</p>
          <p>Precio: {books[currentIndex]?.price}</p>
        </div>
        {/* Botón para desplazarse al siguiente libro */}
        <button className="button" onClick={nextBook}>&#10095;</button>
      </div>
      <br />
      <br />
      <div>
        <h2>Actualizar información</h2>
       

        {formData && (
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <br />
          <label>
            Autor:
            <input type="text" name="author" value={formData.author} onChange={handleChange} />
          </label>
          <br />
          <label>
            Año de Publicación:
            <input type="text" name="pubYear" value={formData.pubYear} onChange={handleChange} />
          </label>
          <br />
          <label>
            Género:
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
          </label>
          <br />
          <label>
            No. de Páginas
            <input type="text" name="pages" value={formData.pages} onChange={handleChange} />
          </label>
          <br />
          <label>
            Editorial:
            <input type="text" name="editorial" value={formData.editorial} onChange={handleChange} />
          </label>
          <br />
          <label>
            ISSBN:
            <input type="text" name="issbn" value={formData.issbn} onChange={handleChange} />
          </label>
          <br />
          <label>
            Idioma:
            <input type="text" name="language" value={formData.language} onChange={handleChange} />
          </label>
          <br />
          <label>
            Condición:
            <input type="text" name="condition" value={formData.condition} onChange={handleChange} />
          </label>
          <br />
          <label>
            Precio:
            <input type="text" name="price" value={formData.price} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Actualizar</button>
          <br />
          <br />
          <h3>No olvides enviar los datos completos</h3>
        </form>
        )}
      </div>
      <br />
      <br />
      <br />
      {/* Pie de página */}
      <footer className="footer">
        <p>Derechos de autor © 2024. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}