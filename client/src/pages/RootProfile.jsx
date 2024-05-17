import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap

export function RootProfile() {
  // Estado para almacenar la lista de admins
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    names: '',
    surnames: '',
    dni: '',
    address: '',
    id: '',
    birthplace: ''
  });

  // Estado para controlar el índice del admin actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para desplazarse al admin anterior
  const prevAdmin = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? admins.length - 1 : prevIndex - 1));
  };

  // Función para desplazarse al siguiente admin
  const nextAdmin = () => {
    setCurrentIndex((prevIndex) => (prevIndex === admins.length - 1 ? 0 : prevIndex + 1));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        dni: formData.dni,
        names: formData.names,
        surnames: formData.surnames,
        address: formData.address,
        birthplace: formData.birthplace
      };
      const response = await axios.patch(`http://localhost:8000/users/admins/${formData.id}/`, userData);
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
    axios.get('http://localhost:8000/users/admins/')
      .then(response => {
        setAdmins(response.data);
        const currentAdmin = response.data[currentIndex];
        setFormData({
          names: currentAdmin.names,
          surnames: currentAdmin.surnames,
          dni: currentAdmin.dni,
          id: currentAdmin.id,
          address: currentAdmin.address,
          birthplace: currentAdmin.birthplace
        });
      })
      .catch(error => {
        console.error('Error fetching admins:', error);
      });
  }, [currentIndex]); // Ejecutar cuando el currentIndex cambie

  return (
    <div className="container content">
      {/* Encabezado de la página */}
      <h1>Manejo de Administradores</h1>

      {/* Contenido principal */}
      <div className="row">
        <div className="col-md-6">
          {/* Botón para desplazarse al admin anterior */}
          <button className="btn btn-primary" onClick={prevAdmin}>&#10094;</button>
        </div>
        <div className="col-md-6 text-right">
          {/* Botón para desplazarse al siguiente admin */}
          <button className="btn btn-primary" onClick={nextAdmin}>&#10095;</button>
        </div>
      </div>
      <br />
      <div>
        <h2>Actualizar información</h2>
        {formData && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input className="form-control" type="text" name="names" value={formData.names} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Apellidos:</label>
              <input className="form-control" type="text" name="surnames" value={formData.surnames} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>DNI:</label>
              <input className="form-control" type="text" name="dni" value={formData.dni} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input className="form-control" type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Lugar de nacimiento:</label>
              <input className="form-control" type="text" name="birthplace" value={formData.birthplace} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" type="submit">Actualizar</button>
            <br />
            <br />
            <h3>No olvides enviar los datos completos</h3>
          </form>
        )}
      </div>
      <br />
    </div>
  );
}
