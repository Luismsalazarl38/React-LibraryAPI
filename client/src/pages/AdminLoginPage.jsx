import { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import '../index.css'; 

export function AdminLoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/users/login/", formData);
            console.log(response.data);
            // Redirigir al usuario a la página deseada después del inicio de sesión exitoso
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h1>Iniciar Sesión como Administrador</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            placeholder="Nombre de Usuario"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Contraseña"
                            required 
                        />
                    </div>
                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
}
