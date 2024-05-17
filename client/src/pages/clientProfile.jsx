import React, { useState, useEffect } from "react";
import axios from "axios";

export function ClientProfile() {
  // Estado para almacenar los datos del usuario
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    names: '',
    surnames: '',
    dni: '',
    address: '',
    birthplace: ''
  });

  // Función para realizar la consulta GET al backend y obtener los datos del usuario
  const realizarConsulta = async () => {
    try {
      // Obtener el id del usuario desde el almacenamiento local
      const id = localStorage.getItem('id');

      // Realizar la solicitud GET al backend para obtener los datos del usuario
      const response = await axios.get(`http://localhost:8000/users/clients/${id}`);

      // Almacenar los datos del usuario en el estado del componente
      setUsuario(response.data);
      // Inicializar el estado formData con los datos del usuario
      setFormData({
        names: response.data.names,
        surnames: response.data.surnames,
        dni: response.data.dni,
        address: response.data.address,
        birthplace: response.data.birthplace
      });
    } catch (error) {
      // Manejar errores
      console.error('Error al realizar la consulta GET:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const id = localStorage.getItem('id');
      const reqData = {
        names : formData.names,
        surnames : formData.surnames,
        dni : formData.dni,
        address : formData.address,
        birthplace : formData.birthplace
      }
      const response = await axios.patch(`http://localhost:8000/users/clients/${id}/`, reqData);
      if (response) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  // Llamar a la función para realizar la consulta cuando el componente se monte
  useEffect(() => {
    realizarConsulta();
  }, []);

  // Renderizar los datos del usuario si existen
  return (
    <div className="container">
      <br />
      <br />
      <br />
      <br />

  <br />
  <br />
  <h1>Perfil del Cliente</h1>
  {usuario && (
  <div>
    <p><strong>DNI:</strong> {usuario.dni}</p>
    <p><strong>Nombre:</strong> {usuario.names}</p>
    <p><strong>Apellidos:</strong> {usuario.surnames}</p>
    <p><strong>Fecha de Nacimiento:</strong> {usuario.birthdate}</p>
    <p><strong>Lugar de Nacimiento:</strong> {usuario.birthplace}</p>
    <p><strong>Dirección:</strong> {usuario.address}</p>
  </div>
  )}
  <br />
  <br />
  <h2>Actualizar información</h2>
  <div className="form-box">
  {formData && (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input type="text" name="names" value={formData.names} onChange={handleChange} />
      </label>
      <br />
      <label>
        Apellidos:
        <input type="text" name="surnames" value={formData.surnames} onChange={handleChange} />
      </label>
      <br />
      <label>
        DNI:
        <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
      </label>
      <br />
      <label>
        Dirección:
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
      </label>
      <br />
      <label>
        Lugar de nacimiento:
        <input type="text" name="birthplace" value={formData.birthplace} onChange={handleChange} />
      </label>
      <br />
      <button type="submit" className="button">Actualizar</button>
    </form>
    )}
  </div>
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  
</div>

  );
}
