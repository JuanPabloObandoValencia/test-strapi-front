import { ref, computed } from "vue";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, isAuthenticated as checkAuth } from "@/services/strapiService";

// Shared state (singleton pattern) - all instances share the same reactive state
const user = ref(getCurrentUser());
const isAuthenticated = ref(checkAuth());
const loading = ref(false);
const error = ref(null);

/**
 * Composable para manejo de autenticación con Strapi
 * @returns {Object} Funciones y estado de autenticación
 */
export function useStrapiAuth() {
    /**
     * Iniciar sesión
     * @param {string} identifier - Email o username
     * @param {string} password - Contraseña
     */
    const login = async (identifier, password) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await apiLogin({ identifier, password });
            user.value = data.user;
            isAuthenticated.value = true;
            return data;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al iniciar sesión";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Registrar nuevo usuario
     * @param {string} username - Nombre de usuario
     * @param {string} email - Email
     * @param {string} password - Contraseña
     */
    const register = async (username, email, password) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await apiRegister({ username, email, password });
            user.value = data.user;
            isAuthenticated.value = true;
            return data;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al registrar usuario";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Cerrar sesión
     */
    const logout = () => {
        apiLogout();
        user.value = null;
        isAuthenticated.value = false;
    };

    /**
     * Actualizar datos del usuario
     */
    const refreshUser = () => {
        user.value = getCurrentUser();
        isAuthenticated.value = checkAuth();
    };

    return {
        user: computed(() => user.value),
        isAuthenticated: computed(() => isAuthenticated.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        login,
        register,
        logout,
        refreshUser,
    };
}
