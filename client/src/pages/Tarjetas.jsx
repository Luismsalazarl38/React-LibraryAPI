import React, { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/manage/cards/?client=${clientId}`);
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
  
    try {
      const dataToSend = {
        ...formData,
        client: id
      };
  
      await axios.post("http://localhost:8000/manage/cards/", dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      alert("Tarjeta creada exitosamente");
      const response = await axios.get(`http://localhost:8000/manage/cards/?client=${clientId}`);
      setTarjetas(response.data);
      setFormOpen(false);
    } catch (error) {
      console.error("Error al crear tarjeta:", error.response.data);
      alert("Hubo un error al crear la tarjeta");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/manage/cards/${id}/`);
      alert("Tarjeta eliminada exitosamente");
      const response = await axios.get(`http://localhost:8000/manage/cards/?client=${clientId}`);
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
              <input type="text" className="form-control" id="number" name="number" value={formData.number} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Franquicia:</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cv" className="form-label">CV:</label>
              <input type="text" className="form-control" id="cv" name="cv" value={formData.cv} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cadYear" className="form-label">Año de Caducidad:</label>
              <input type="text" className="form-control" id="cadYear" name="cadYear" value={formData.cadYear} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cadMonth" className="form-label">Mes de Caducidad:</label>
              <input type="text" className="form-control" id="cadMonth" name="cadMonth" value={formData.cadMonth} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="wallet" className="form-label">Wallet:</label>
              <input type="text" className="form-control" id="wallet" name="wallet" value={formData.wallet} onChange={handleChange} />
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
                {/* <h5 className="card-title">Cliente: {tarjeta.client}</h5> */}
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
