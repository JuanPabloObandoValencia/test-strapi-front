import api from "./api";

/**
 * Servicio para interactuar con Strapi
 * Proporciona métodos helper para operaciones comunes
 */

// ==================== AUTENTICACIÓN ====================

/**
 * Registrar un nuevo usuario
 * @param {Object} userData - { username, email, password }
 * @returns {Promise} Respuesta con jwt y user
 */
export const register = async (userData) => {
    const response = await api.post("/auth/local/register", userData);
    if (response.data.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

/**
 * Iniciar sesión
 * @param {Object} credentials - { identifier, password }
 * @returns {Promise} Respuesta con jwt y user
 */
export const login = async (credentials) => {
    const response = await api.post("/auth/local", credentials);
    if (response.data.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

/**
 * Cerrar sesión
 */
export const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
};

/**
 * Obtener usuario actual
 * @returns {Object|null} Usuario o null
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("jwt");
};

// ==================== OPERACIONES CRUD ====================

/**
 * Obtener todos los elementos de una colección
 * @param {string} collection - Nombre de la colección (ej: 'articles')
 * @param {Object} params - Parámetros de query (populate, filters, sort, pagination)
 * @returns {Promise} Datos de la colección
 */
export const getAll = async (collection, params = {}) => {
    const response = await api.get(`/${collection}`, { params });
    return response.data;
};

/**
 * Obtener un elemento por ID
 * @param {string} collection - Nombre de la colección
 * @param {number|string} id - ID del elemento
 * @param {Object} params - Parámetros de query (populate)
 * @returns {Promise} Datos del elemento
 */
export const getById = async (collection, id, params = {}) => {
    const response = await api.get(`/${collection}/${id}`, { params });
    return response.data;
};

/**
 * Crear un nuevo elemento
 * @param {string} collection - Nombre de la colección
 * @param {Object} data - Datos del elemento
 * @returns {Promise} Elemento creado
 */
export const create = async (collection, data) => {
    const response = await api.post(`/${collection}`, { data });
    return response.data;
};

/**
 * Actualizar un elemento
 * @param {string} collection - Nombre de la colección
 * @param {number|string} id - ID del elemento
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Elemento actualizado
 */
export const update = async (collection, id, data) => {
    const response = await api.put(`/${collection}/${id}`, { data });
    return response.data;
};

/**
 * Eliminar un elemento
 * @param {string} collection - Nombre de la colección
 * @param {number|string} id - ID del elemento
 * @returns {Promise} Elemento eliminado
 */
export const remove = async (collection, id) => {
    const response = await api.delete(`/${collection}/${id}`);
    return response.data;
};

// ==================== MANEJO DE ARCHIVOS ====================

/**
 * Subir un archivo
 * @param {File} file - Archivo a subir
 * @param {Object} options - Opciones adicionales (ref, refId, field)
 * @returns {Promise} Archivo subido
 */
export const uploadFile = async (file, options = {}) => {
    const formData = new FormData();
    formData.append("files", file);

    if (options.ref) formData.append("ref", options.ref);
    if (options.refId) formData.append("refId", options.refId);
    if (options.field) formData.append("field", options.field);

    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Obtener archivos
 * @param {Object} params - Parámetros de filtrado
 * @returns {Promise} Lista de archivos
 */
export const getFiles = async (params = {}) => {
    const response = await api.get("/upload/files", { params });
    return response.data;
};

/**
 * Eliminar un archivo
 * @param {number|string} id - ID del archivo
 * @returns {Promise} Archivo eliminado
 */
export const deleteFile = async (id) => {
    const response = await api.delete(`/upload/files/${id}`);
    return response.data;
};

// ==================== UTILIDADES ====================

/**
 * Construir URL completa para archivos de Strapi
 * @param {string} url - URL relativa del archivo
 * @returns {string} URL completa
 */
export const getStrapiURL = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
    const strapiURL = baseURL.replace("/api", "");
    return `${strapiURL}${url}`;
};

/**
 * Extraer datos de la respuesta de Strapi (maneja formato v4)
 * @param {Object} response - Respuesta de Strapi
 * @returns {Object|Array} Datos extraídos
 */
export const extractStrapiData = (response) => {
    if (!response) return null;

    // Si es un array de elementos
    if (response.data && Array.isArray(response.data)) {
        return response.data.map(item => ({
            id: item.id,
            ...item.attributes
        }));
    }

    // Si es un solo elemento
    if (response.data && response.data.attributes) {
        return {
            id: response.data.id,
            ...response.data.attributes
        };
    }

    return response.data || response;
};

export default {
    // Auth
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    // CRUD
    getAll,
    getById,
    create,
    update,
    remove,
    // Files
    uploadFile,
    getFiles,
    deleteFile,
    // Utils
    getStrapiURL,
    extractStrapiData,
};
