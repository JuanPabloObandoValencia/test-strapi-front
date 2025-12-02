import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:1337/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de error
            switch (error.response.status) {
                case 401:
                    // Token inválido o expirado
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("user");
                    // Opcional: redirigir a login
                    // window.location.href = '/login';
                    break;
                case 403:
                    console.error("No tienes permisos para esta acción");
                    break;
                case 404:
                    console.error("Recurso no encontrado");
                    break;
                case 500:
                    console.error("Error del servidor");
                    break;
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            console.error("No se pudo conectar con el servidor");
        } else {
            // Algo pasó al configurar la petición
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;