import React, { useState, useEffect } from "react";
import axios from "axios";

export function AdminBooks() {
  const [stores, setStores] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    store: "",
    title: "",
    author: "",
    pubYear: "",
    gender: [],
    pages: "",
    editorial: "",
    issbn: "",
    language: "",
    condition: "",
    price: "",
    pubDate: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [newBookData, setNewBookData] = useState({
    store: "",
    title: "",
    author: "",
    pubYear: "",
    gender: [],
    pages: "",
    editorial: "",
    issbn: "",
    language: "",
    condition: "",
    price: "",
    pubDate: "",
    image: null
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const prevBook = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));
  };

  const nextBook = () => {
    setCurrentIndex((prevIndex) => (prevIndex === books.length - 1 ? 0 : prevIndex + 1));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewBookChange = (event) => {
    const { name, value, files, type } = event.target;
    if (type === "checkbox") {
      const newGender = [...newBookData.gender];
      if (event.target.checked) {
        newGender.push(value);
      } else {
        const index = newGender.indexOf(value);
        if (index > -1) {
          newGender.splice(index, 1);
        }
      }
      setNewBookData({ ...newBookData, [name]: newGender });
    } else if (name === "image") {
      setNewBookData({ ...newBookData, [name]: files[0] });
    } else {
      setNewBookData({ ...newBookData, [name]: value });
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.title) errors.title = "El título es obligatorio";
    if (!data.author) errors.author = "El autor es obligatorio";
    if (!data.pubYear || isNaN(data.pubYear)) errors.pubYear = "El año de publicación debe ser un número";
    if (!data.pages || isNaN(data.pages)) errors.pages = "El número de páginas debe ser un número";
    if (!data.issbn || isNaN(data.issbn)) errors.issbn = "El ISSBN debe ser un número";
    if (!data.language) errors.language = "El idioma es obligatorio";
    if (!data.condition) errors.condition = "La condición es obligatoria";
    if (!data.price || isNaN(data.price)) errors.price = "El precio debe ser un número";
    if (!data.gender || data.gender.length === 0) errors.gender = "Debe seleccionar al menos un género";

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const userData = {
        title: formData.title,
        author: formData.author,
        pubYear: formData.pubYear,
        gender: formData.gender.join(", "),
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
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleNewBookSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(newBookData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const formData = new FormData();
      for (const key in newBookData) {
        if (key === "gender") {
          formData.append(key, newBookData[key].join(", "));
        } else {
          formData.append(key, newBookData[key]);
        }
      }

      const response = await axios.post("http://localhost:8000/manage/books/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 201) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al crear el nuevo libro:", error);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8000/manage/books/")
      .then(response => {
        setBooks(response.data);
        const currentBook = response.data[currentIndex];
        setFormData({
          id: currentBook.id,
          store: currentBook.store,
          title: currentBook.title,
          author: currentBook.author,
          pubYear: currentBook.pubYear,
          gender: currentBook.gender.split(", "),
          pages: currentBook.pages,
          editorial: currentBook.editorial,
          issbn: currentBook.issbn,
          language: currentBook.language,
          condition: currentBook.condition,
          price: currentBook.price
        });
      })
      .catch(error => {
        console.error("Error fetching books:", error);
      });

    axios.get("http://localhost:8000/manage/stores/")
      .then(response => {
        setStores(response.data);
      })
      .catch(error => {
        console.error("Error fetching stores:", error);
      });
  }, [currentIndex]);

  return (
    <div className="container content">
      <h1>Manejo de Libros</h1>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Agregar un nuevo libro"}
      </button>

      {showForm && (
        <form onSubmit={handleNewBookSubmit}>
          <div className="mb-3">
            <label className="form-label">Tienda:</label>
            <select
              className="form-select"
              name="store"
              value={newBookData.store}
              onChange={handleNewBookChange}
              required
            >
              <option value="">Seleccionar Tienda</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.id}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Título:</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={newBookData.title}
              onChange={handleNewBookChange}
              required
            />
            {errors.title && <p className="text-danger">{errors.title}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Autor:</label>
            <input
              type="text"
              className="form-control"
              name="author"
              value={newBookData.author}
              onChange={handleNewBookChange}
              required
            />
            {errors.author && <p className="text-danger">{errors.author}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Año de Publicación:</label>
            <input
              type="number"
              className="form-control"
              name="pubYear"
              value={newBookData.pubYear}
              onChange={handleNewBookChange}
              required
            />
            {errors.pubYear && <p className="text-danger">{errors.pubYear}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Género:</label>
            <div>
              {["Ficción", "No Ficción", "Fantasía", "Misterio", "Ciencia Ficción", "Biografía"].map((genre) => (
                <div key={genre} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="gender"
                    value={genre}
                    checked={newBookData.gender.includes(genre)}
                    onChange={handleNewBookChange}
                  />
                  <label className="form-check-label">{genre}</label>
                </div>
              ))}
            </div>
            {errors.gender && <p className="text-danger">{errors.gender}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Número de Páginas:</label>
            <input
              type="number"
              className="form-control"
              name="pages"
              value={newBookData.pages}
              onChange={handleNewBookChange}
              required
            />
            {errors.pages && <p className="text-danger">{errors.pages}</p>}
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
              type="number"
              className="form-control"
              name="issbn"
              value={newBookData.issbn}
              onChange={handleNewBookChange}
              required
            />
            {errors.issbn && <p className="text-danger">{errors.issbn}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Idioma:</label>
            <select
              className="form-select"
              name="language"
              value={newBookData.language}
              onChange={handleNewBookChange}
              required
            >
              <option value="">Seleccionar Idioma</option>
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Alemán">Alemán</option>
              <option value="Chino">Chino</option>
            </select>
            {errors.language && <p className="text-danger">{errors.language}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Condición:</label>
            <select
              className="form-select"
              name="condition"
              value={newBookData.condition}
              onChange={handleNewBookChange}
              required
            >
              <option value="">Seleccionar Condición</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
            {errors.condition && <p className="text-danger">{errors.condition}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Precio:</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={newBookData.price}
              onChange={handleNewBookChange}
              required
            />
            {errors.price && <p className="text-danger">{errors.price}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha de Publicación:</label>
            <input
              type="date"
              className="form-control"
              name="pubDate"
              value={newBookData.pubDate}
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
          <button type="submit" className="btn btn-primary">Crear nuevo libro</button>
        </form>
      )}

      {books.length > 0 && (
        <>
          <div className="slider">
            <button className="button" onClick={prevBook}>&#10094;</button>
            <div className="book-details">
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
            <button className="button" onClick={nextBook}>&#10095;</button>
          </div>
          <div>
            <h2>Actualizar información</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Título:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="text-danger">{errors.title}</p>}
              </label>
              <label>
                Autor:
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
                {errors.author && <p className="text-danger">{errors.author}</p>}
              </label>
              <label>
                Año de Publicación:
                <input
                  type="number"
                  name="pubYear"
                  value={formData.pubYear}
                  onChange={handleChange}
                />
                {errors.pubYear && <p className="text-danger">{errors.pubYear}</p>}
              </label>
              <label>
                Género:
                <div>
                  {["Ficción", "No Ficción", "Fantasía", "Misterio", "Ciencia Ficción", "Biografía"].map((genre) => (
                    <div key={genre} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="gender"
                        value={genre}
                        checked={formData.gender.includes(genre)}
                        onChange={(event) => {
                          const newGender = [...formData.gender];
                          if (event.target.checked) {
                            newGender.push(genre);
                          } else {
                            const index = newGender.indexOf(genre);
                            if (index > -1) {
                              newGender.splice(index, 1);
                            }
                          }
                          setFormData({ ...formData, gender: newGender });
                        }}
                      />
                      <label className="form-check-label">{genre}</label>
                    </div>
                  ))}
                </div>
                {errors.gender && <p className="text-danger">{errors.gender}</p>}
              </label>
              <label>
                Número de Páginas:
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                />
                {errors.pages && <p className="text-danger">{errors.pages}</p>}
              </label>
              <label>
                Editorial:
                <input
                  type="text"
                  name="editorial"
                  value={formData.editorial}
                  onChange={handleChange}
                />
              </label>
              <label>
                ISSBN:
                <input
                  type="number"
                  name="issbn"
                  value={formData.issbn}
                  onChange={handleChange}
                />
                {errors.issbn && <p className="text-danger">{errors.issbn}</p>}
              </label>
              <label>
                Idioma:
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar Idioma</option>
                  <option value="Español">Español</option>
                  <option value="Inglés">Inglés</option>
                  <option value="Francés">Francés</option>
                  <option value="Alemán">Alemán</option>
                  <option value="Chino">Chino</option>
                </select>
                {errors.language && <p className="text-danger">{errors.language}</p>}
              </label>
              <label>
                Condición:
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar Condición</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                </select>
                {errors.condition && <p className="text-danger">{errors.condition}</p>}
              </label>
              <label>
                Precio:
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <p className="text-danger">{errors.price}</p>}
              </label>
              <button type="submit">Actualizar</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
