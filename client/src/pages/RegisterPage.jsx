import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import countryOptions from '../components/conuntries.js';
import addYears from 'date-fns/addYears';

import 'bootstrap/dist/css/bootstrap.min.css';

export function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        names: '',
        surnames: '',
        birthdate: null,
        birthplace: '',
        favTopics: [],
        gender: '',
        dni: '',
        address: '',
        dniError: '',
        addressError: ''
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const today = new Date();
    const minDate = addYears(today, -18);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        // Validar el formato del correo electrónico
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError('Por favor, ingrese un correo electrónico válido');
            } else {
                setEmailError('');
            }
        }
    
        // Validar que el DNI contenga solo números
        if (name === 'dni') {
            const dniRegex = /^[0-9]*$/;
            if (!dniRegex.test(value)) {
                setFormData(prevState => ({
                    ...prevState,
                    dniError: 'El DNI debe contener solo números'
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    dniError: ''
                }));
            }
        }
    
        // Validar que los campos de dirección sean números
        if (name === 'street' || name === 'number') {
            const numberRegex = /^[0-9]*$/;
            if (!numberRegex.test(value)) {
                setFormData(prevState => ({
                    ...prevState,
                    addressError: 'La calle y el número deben contener solo números'
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    addressError: ''
                }));
            }
        }
    
        // Validar que la contraseña y la confirmación de contraseña sean iguales
        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                setPasswordError('Las contraseñas no coinciden');
            } else {
                setPasswordError('');
            }
        }
    
        // Validar la contraseña
        if (name === 'password') {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,}$/;
            if (!passwordRegex.test(value)) {
                setPasswordError('La contraseña debe contener al menos una mayúscula, un número y tener al menos 7 caracteres');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => {
            if (checked) {
                return { ...prevState, favTopics: [...prevState.favTopics, value] };
            } else {
                return { ...prevState, favTopics: prevState.favTopics.filter(topic => topic !== value) };
            }
        });
    };

    const handleChangeDate = (date) => {
        setFormData(prevState => ({
            ...prevState,
            birthdate: date
        }));
    };

    const handleSelectChange = (selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            birthplace: selectedOption.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const addressString = `${formData.street || ''} ${formData.number || ''}, ${formData.neighborhood || ''}, ${formData.municipality || ''}, ${formData.department || ''}`;

            const userData = {
                user: {
                    username: formData.email,
                    password: formData.password
                },
                dni: formData.dni,
                names: formData.names,
                surnames: formData.surnames,
                birthdate: formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : '',
                birthplace: formData.birthplace,
                address: addressString,
                gender: formData.gender === 'Hombre' ? 'Masculino' : formData.gender,
                fav_topics: formData.favTopics.join(', '),
            };

            const response = await axios.post("http://localhost:8000/users/clients/", userData);
            console.log(response.data);
            window.location.href = '/task-create';
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    return (
        <div className="container">
            <br /><br />
            <div className="form-box">
                <h1>Registro de Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Correo Electrónico"
                            required
                        />
                        {emailError && <div className="text-danger">{emailError}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Contraseña"
                            required
                        />
                        {passwordError && <div className="text-danger">{passwordError}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Confirmar Contraseña"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="names"
                            name="names"
                            value={formData.names}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Nombres"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="surnames"
                            name="surnames"
                            value={formData.surnames}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Apellidos"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthdate">Fecha de Nacimiento:</label>
                        <DatePicker
                            id="birthdate"
                            name="birthdate"
                            selected={formData.birthdate}
                            onChange={handleChangeDate}
                            className="form-control"
                            placeholderText="Seleccione fecha"
                            dateFormat="dd/MM/yyyy"
                            maxDate={minDate}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthplace">Lugar de Nacimiento:</label>
                        <Select
                            id="birthplace"
                            name="birthplace"
                            value={countryOptions.find(option => option.value === formData.birthplace)}
                            onChange={handleSelectChange}
                            options={countryOptions}
                            className="form-control"
                            placeholder="Seleccione lugar de nacimiento"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Temas de Libros de Preferencia:</label>
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="favTopics"
                                    value="Ciencia Ficción"
                                    checked={formData.favTopics.includes("Ciencia Ficción")}
                                    onChange={handleCheckboxChange}
                                />
                                Ciencia Ficción
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="favTopics"
                                    value="Romance"
                                    checked={formData.favTopics.includes("Romance")}
                                    onChange={handleCheckboxChange}
                                />
                                Romance
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="favTopics"
                                    value="Misterio"
                                    checked={formData.favTopics.includes("Misterio")}
                                    onChange={handleCheckboxChange}
                                />
                                Misterio
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Género:</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">Seleccionar Género</option>
                            <option value="Hombre">Hombre</option>
                            <option value="Mujer">Mujer</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dni">DNI:</label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Ingrese su DNI"
                            required
                        />
                        {formData.dniError && <div className="text-danger">{formData.dniError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Dirección:</label>
                        <div className="row">
                            <div className="col-sm">
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Calle o Manzana"
                                    required
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Número"
                                    required
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="text"
                                    id="neighborhood"
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Barrio"
                                    required
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="text"
                                    id="municipality"
                                    name="municipality"
                                    value={formData.municipality}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Municipio"
                                    required
                                />
                            </div>
                            <div className="col-sm">
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Departamento"
                                    required
                                />
                            </div>
                        </div>
                        {formData.addressError && <div className="text-danger">{formData.addressError}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Registrarse</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
