import axios from "axios";

// Define una instancia de Axios con la URL base
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/users/"
});

// Función para obtener todas las tareas
export const getAllTask = () => {
    return axiosInstance.get("/clients/");
}

// Función para crear una nueva tarea
export const createTask = (taskData) => {
    return axiosInstance.post("/clients/", taskData);
}
