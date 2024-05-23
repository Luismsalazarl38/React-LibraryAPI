import React, { useState, useEffect } from "react";
import axios from "axios";

export function AdminStores() {
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    address: '',
    openingTime: '',
    closingTime: '',
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevStore = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? stores.length - 1 : prevIndex - 1));
  };

  const nextStore = () => {
    setCurrentIndex((prevIndex) => (prevIndex === stores.length - 1 ? 0 : prevIndex + 1));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const schedule = `${formData.openingTime} - ${formData.closingTime}`;
      const userData = {
        address: formData.address,
        schedule,
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

  useEffect(() => {
    axios.get('http://localhost:8000/manage/stores/')
      .then(response => {
        setStores(response.data);
        const currentStore = response.data[currentIndex];
        setFormData({
          id: currentStore.id,
          address: currentStore.address,
          openingTime: currentStore.schedule.split(' - ')[0],
          closingTime: currentStore.schedule.split(' - ')[1],
        });
      })
      .catch(error => {
        console.error('Error fetching stores:', error);
      });
  }, [currentIndex]);

  return (
    <div className="container content">
      <h1>Manejo de Tiendas</h1>
      <div className="slider">
        <button className="button" onClick={prevStore}>&#10094;</button>
        <div className="book-details">
          <p>ID Tienda: {stores[currentIndex]?.id}</p>
          <p>Dirección: {stores[currentIndex]?.address}</p>
          <p>Horario: {stores[currentIndex]?.schedule}</p>
        </div>
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
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Horario de apertura:
              <input
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Horario de cierre:
              <input
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
              />
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
      <footer className="footer">
        <p>Derechos de autor © 2024. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}