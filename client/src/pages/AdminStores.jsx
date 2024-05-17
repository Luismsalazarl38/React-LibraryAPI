import React, { useState, useEffect } from "react";
import axios from "axios";

export function AdminStores() {
  // Estado para almacenar la lista de admins
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    address: '',
    schedule: ''
  });

  // Estado para controlar el índice del admin actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para desplazarse al admin anterior
  const prevStore = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? stores.length - 1 : prevIndex - 1));
  };

  // Función para desplazarse al siguiente admin
  const nextStore  = () => {
    setCurrentIndex((prevIndex) => (prevIndex === stores.length - 1 ? 0 : prevIndex + 1));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        address: formData.address,
        schedule: formData.schedule
    };
      const response = await axios.patch(`http://localhost:8000/manage/stores/${formData.id}/`, userData);
      if (response) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  // Función para cargar los admins desde el servidor
  useEffect(() => {
    axios.get('http://localhost:8000/manage/stores/')
      .then(response => {
        setStores(response.data);
        const currentStore = response.data[currentIndex];
        setFormData({
            id: currentStore.id,
            address: currentStore.address,
            schedule: currentStore.schedule
          });
      })
      .catch(error => {
        console.error('Error fetching stores:', error);
      });
  }, [currentIndex]); // Ejecutar cuando el currentIndex cambie

  return (
    <div className="container content">
      {/* Encabezado de la página */}
      <h1>Manejo de Tiendas</h1>

      {/* Contenido principal */}
      <div className="slider">
        {/* Botón para desplazarse al admin anterior */}
        <button className="button" onClick={prevStore}>&#10094;</button>

        {/* Detalles del admin actual */}
        <div className="book-details">
          {/* Mostrar la imagen del libro si existe */}
          <p>ID Tienda: {stores[currentIndex]?.id}</p>
          <p>Dirección: {stores[currentIndex]?.address}</p>
          <p>Horario: {stores[currentIndex]?.schedule}</p>

        </div>
        {/* Botón para desplazarse al siguiente admin */}
        <button className="button" onClick={nextStore}>&#10095;</button>
      </div>
      <br />
      <br />
      <div>
        <h2>Actualizar información</h2>
        {formData && (
        <form onSubmit={handleSubmit}>
          <label>
            Dirección:
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
          <br />
          <label>
            Horario:
            <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} />
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