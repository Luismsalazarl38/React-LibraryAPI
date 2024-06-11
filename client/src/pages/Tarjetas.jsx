import React, { useState, useEffect } from "react";
import axios from "axios";
import backendURL from "../config"; // Importa la variable backendURL desde el archivo config.js


export function Tarjetas({ clientId }) {
  const [formData, setFormData] = useState({
    client: "",
    number: "",
    name: "",
    cv: "",
    cadYear: "",
    cadMonth: "",
    wallet: ""
  });
  const [formOpen, setFormOpen] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const response = await axios.get(`${backendURL}/manage/cards/?client=${clientId}`);
        setTarjetas(response.data);
      } catch (error) {
        console.error("Error fetching tarjetas:", error);
      }
    };

    fetchTarjetas();
  }, [clientId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const id = localStorage.getItem('id');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    const validationErrors = {};
    if (formData.number.length < 13 || !/^\d+$/.test(formData.number)) {
      validationErrors.number = "El número de tarjeta debe tener al menos 13 dígitos y contener solo números.";
    }
    if (!formData.name) {
      validationErrors.name = "Por favor selecciona una franquicia de tarjeta.";
    }
    if (formData.cv.length !== 3 || !/^\d+$/.test(formData.cv)) {
      validationErrors.cv = "El CV debe ser un número de 3 dígitos.";
    }
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Los meses comienzan desde 0
    if (parseInt(formData.cadYear, 10) < currentYear || (parseInt(formData.cadYear, 10) === currentYear && parseInt(formData.cadMonth, 10) < currentMonth)) {
      validationErrors.expiry = "La fecha de caducidad debe ser mayor que la fecha actual.";
    }
    if (parseFloat(formData.wallet) <= 0 || !/^\d*\.?\d+$/.test(formData.wallet)) {
      validationErrors.wallet = "El saldo debe ser un número positivo.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        client: id
      };

      await axios.post(`${backendURL}/manage/cards/`, dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert("Tarjeta creada exitosamente");
      const response = await axios.get(`${backendURL}/manage/cards/?client=${clientId}`);
      setTarjetas(response.data);
      setFormOpen(false);
    } catch (error) {
      console.error("Error al crear tarjeta:", error.response.data);
      alert("Hubo un error al crear la tarjeta");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendURL}/manage/cards/${id}/`);
      alert("Tarjeta eliminada exitosamente");
      const response = await axios.get(`${backendURL}/manage/cards/?client=${clientId}`);
      setTarjetas(response.data);
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
      alert("Hubo un error al eliminar la tarjeta");
    }
  };

  return (
    <div className="container">
      <h1>Tarjetas</h1>
      <button className="btn btn-primary mb-3" onClick={() => setFormOpen(!formOpen)}>
        {formOpen ? "Cerrar Formulario" : "Agregar Nueva Tarjeta"}
      </button>
      {formOpen && (
        <div>
          <h2>Formulario de Nueva Tarjeta</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="number" className="form-label">Número de Tarjeta:</label>
              <input type="text" className={`form-control ${errors.number && 'is-invalid'}`} id="number" name="number" value={formData.number} onChange={handleChange} />
              {errors.number && <div className="invalid-feedback">{errors.number}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Franquicia:</label>
              <select className={`form-select ${errors.name && 'is-invalid'}`} name="name" value={formData.name} onChange={handleChange}>
                <option value="">Selecciona una franquicia</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                {/* Agrega más opciones de franquicias aquí si lo deseas */}
              </select>
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cv" className="form-label">CV:</label>
              <input type="text" className={`form-control ${errors.cv && 'is-invalid'}`} id="cv" name="cv" value={formData.cv} onChange={handleChange} />
              {errors.cv && <div className="invalid-feedback">{errors.cv}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cadYear" className="form-label">Año de Caducidad:</label>
              <input type="text" className={`form-control ${errors.expiry && 'is-invalid'}`} id="cadYear" name="cadYear" value={formData.cadYear} onChange={handleChange} />
              <label htmlFor="cadMonth" className="form-label">Mes de Caducidad:</label>
              <input type="text" className={`form-control ${errors.expiry && 'is-invalid'}`} id="cadMonth" name="cadMonth" value={formData.cadMonth} onChange={handleChange} />
              {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="wallet" className="form-label">Wallet:</label>
              <input type="text" className={`form-control ${errors.wallet && 'is-invalid'}`} id="wallet" name="wallet" value={formData.wallet} onChange={handleChange} />
              {errors.wallet && <div className="invalid-feedback">{errors.wallet}</div>}
            </div>
            <button type="submit" className="btn btn-success">Crear Tarjeta</button>
          </form>
        </div>
      )}
      <div className="row">
        {tarjetas.map((tarjeta) => (
          <div key={tarjeta.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">Número: {tarjeta.number}</p>
                <p className="card-text">Franquicia: {tarjeta.name}</p>
                <p className="card-text">Saldo: {tarjeta.wallet}</p>
                <button onClick={() => handleDelete(tarjeta.id)} className="btn btn-danger">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
