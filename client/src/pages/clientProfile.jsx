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
        dniError: '',
        numberError: '',
        namesError: '',
        surnamesError: ''
    });
    const [addressError, setAddressError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        let errorMessage = '';

        // Validar que el DNI contenga solo números
        if (name === 'dni') {
            const dniRegex = /^[0-9]*$/;
            if (!dniRegex.test(value)) {
                errorMessage = 'El DNI debe contener solo números';
            }
        } else if (name === 'number') {
            const numberRegex = /^[0-9]*$/;
            if (!numberRegex.test(value)) {
                errorMessage = 'El número de dirección debe contener solo números';
            }
        } else if (name === 'names') {
            const nameRegex = /^[^0-9]*$/;
            if (!nameRegex.test(value)) {
                errorMessage = 'El nombre no puede contener números';
            }
        } else if (name === 'surnames') {
            const surnameRegex = /^[^0-9]*$/;
            if (!surnameRegex.test(value)) {
                errorMessage = 'El apellido no puede contener números';
            }
        }

        // Setear el mensaje de error en el estado si existe
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
            dniError: name === 'dni' ? errorMessage : prevFormData.dniError,
            numberError: name === 'number' ? errorMessage : prevFormData.numberError,
            namesError: name === 'names' ? errorMessage : prevFormData.namesError,
            surnamesError: name === 'surnames' ? errorMessage : prevFormData.surnamesError
        }));

        // Reiniciar el mensaje de error de dirección si algún campo está vacío
        if (name === 'street' || name === 'number' || name === 'neighborhood' || name === 'municipality' || name === 'department') {
            if (formData.street === '' || formData.number === '' || formData.neighborhood === '' || formData.municipality === '' || formData.department === '') {
                setAddressError('');
            } else {
                setAddressError(errorMessage);
            }
        }
    };

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
                address: response.data.address
            });
        } catch (error) {
            // Manejar errores
            console.error('Error al realizar la consulta GET:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const id = localStorage.getItem('id');
            // Concatenar los campos de dirección en un solo string separado por comas
            const addressString = `${formData.street || ''} ${formData.number || ''}, ${formData.neighborhood || ''}, ${formData.municipality || ''}, ${formData.department || ''}`;
            const reqData = {
                names: formData.names,
                surnames: formData.surnames,
                dni: formData.dni,
                address: addressString // Asignar la dirección concatenada
            };
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
                    <p><strong>Dirección:</strong> {usuario.address}</p>
                </div>
            )}
            <br />
            <br />
            <h2>Actualizar información</h2>
            <div className="form-box">
                {formData && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="names">Nombre:</label>
                            <input
                                type="text"
                                name="names"
                                value={formData.names}
                                onChange={handleChange}
                                className={`form-control ${formData.namesError && 'is-invalid'}`}
                                placeholder="Ingrese su nombre"
                                required
                            />
                            {formData.namesError && <div className="invalid-feedback">{formData.namesError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="surnames">Apellidos:</label>
                            <input
                                type="text"
                                name="surnames"
                                value={formData.surnames}
                                onChange={handleChange}
                                className={`form-control ${formData.surnamesError && 'is-invalid'}`}
                                placeholder="Ingrese sus apellidos"
                                required
                            />
                            {formData.surnamesError && <div className="invalid-feedback">{formData.surnamesError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dni">DNI:</label>
                            <input
                                type="text"
                                id="dni"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                className={`form-control ${formData.dniError && 'is-invalid'}`}
                                placeholder="Ingrese su DNI"
                                required
                            />
                            {formData.dniError && <div className="invalid-feedback">{formData.dniError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Dirección:</label>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control mr-2"
                                    name="street"
                                    placeholder="Calle"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    className={`form-control mr-2 ${formData.numberError && 'is-invalid'}`}
                                    name="number"
                                    placeholder="Número"
                                    value={formData.number}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    className="form-control mr-2"
                                    name="neighborhood"
                                    placeholder="Barrio"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    className="form-control mr-2"
                                    name="municipality"
                                    placeholder="Municipio"
                                    value={formData.municipality}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="department"
                                    placeholder="Departamento"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                            {addressError && <div className="invalid-feedback">{addressError}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary">Actualizar</button>
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
