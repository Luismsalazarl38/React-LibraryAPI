import React from 'react';
import axios from 'axios';

function LogoutPage() {
    const handleLogout = async () => {
        try {
            // Obtenemos el token de acceso del almacenamiento local
            const accessToken = localStorage.getItem('accessToken');

            // Verificamos si el token de acceso existe y es válido
            if (!accessToken) {
                console.error('Token de acceso no encontrado');
                return;
            }

            // Realizamos la solicitud de logout con el token de acceso
            const response = await axios.post('http://localhost:8000/users/logout/', null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`  
                }
            });

            // Eliminamos el token de acceso del almacenamiento local
            localStorage.removeItem('accessToken');
            localStorage.removeItem('type');
            localStorage.removeItem('id');

            // Redirigimos al usuario a la página de inicio de sesión
            window.location.href = '/task-create';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div>
            <h1>Cerrar sesión</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}

export default LogoutPage;
