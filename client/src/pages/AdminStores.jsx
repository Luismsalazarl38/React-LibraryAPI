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
  const [newStoreData, setNewStoreData] = useState({
    address: '',
    openingTime: '',
    closingTime: '',
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleNewStoreChange = (event) => {
    const { name, value } = event.target;
    setNewStoreData({ ...newStoreData, [name]: value });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.address) {
      errors.address = "La dirección es obligatoria";
    }
    if (!data.openingTime) {
      errors.openingTime = "El horario de apertura es obligatorio";
    }
    if (!data.closingTime) {
      errors.closingTime = "El horario de cierre es obligatorio";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm(formData);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
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
    }
  };

  const handleNewStoreSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm(newStoreData);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const schedule = `${newStoreData.openingTime} - ${newStoreData.closingTime}`;
        const userData = {
          address: newStoreData.address,
          schedule,
        };
        const response = await axios.post('http://localhost:8000/manage/stores/', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 201) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error al crear la nueva tienda:', error);
      }
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
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Agregar una nueva tienda"}
      </button>

      {showForm && (
        <form onSubmit={handleNewStoreSubmit}>
          <div className="mb-3">
            <label className="form-label">Dirección:</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={newStoreData.address}
              onChange={handleNewStoreChange}
              required
            />
            {errors.address && <p className="text-danger">{errors.address}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Horario de apertura:</label>
            <input
              type="time"
              className="form-control"
              name="openingTime"
              value={newStoreData.openingTime}
              onChange={handleNewStoreChange}
              required
            />
            {errors.openingTime && <p className="text-danger">{errors.openingTime}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Horario de cierre:</label>
            <input
              type="time"
              className="form-control"
              name="closingTime"
              value={newStoreData.closingTime}
              onChange={handleNewStoreChange}
              required
            />
            {errors.closingTime && <p className="text-danger">{errors.closingTime}</p>}
          </div>
          <button type="submit" className="btn btn-primary">
            Crear nueva tienda
          </button>
        </form>
      )}

      <div className="slider">
        <button className="button" onClick={prevStore}>&#10094;</button>
        <div className="book-details">
          <p>ID Tienda: {stores[currentIndex]?.id}</p>
          <p>Dirección: {stores[currentIndex]?.address}</p>
          <p>Horario: {stores[currentIndex]?.schedule}</p>
        </div>
        <button className="button" onClick={nextStore}>&#10095;</button>
      </div>

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
              {errors.address && <p className="text-danger">{errors.address}</p>}
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
              {errors.openingTime && <p className="text-danger">{errors.openingTime}</p>}
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
              {errors.closingTime && <p className="text-danger">{errors.closingTime}</p>}
            </label>
            <br />
            <button type="submit">Actualizar</button>
          </form>
        )}
      </div>

      <footer className="footer">
        <p>Derechos de autor © 2024. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
