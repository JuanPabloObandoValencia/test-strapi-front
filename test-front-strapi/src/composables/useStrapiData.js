import { ref, computed } from "vue";
import { getAll, getById, create, update, remove, extractStrapiData } from "@/services/strapiService";

/**
 * Composable para manejo de datos de Strapi
 * @param {string} collection - Nombre de la colección de Strapi
 * @returns {Object} Funciones y estado para CRUD operations
 */
export function useStrapiData(collection) {
    const data = ref(null);
    const items = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const meta = ref(null);

    /**
     * Obtener todos los elementos
     * @param {Object} params - Parámetros de query (populate, filters, sort, pagination)
     */
    const fetchAll = async (params = {}) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await getAll(collection, params);
            items.value = extractStrapiData(response);
            meta.value = response.meta;
            return items.value;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al obtener datos";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obtener un elemento por ID
     * @param {number|string} id - ID del elemento
     * @param {Object} params - Parámetros de query (populate)
     */
    const fetchById = async (id, params = {}) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await getById(collection, id, params);
            data.value = extractStrapiData(response);
            return data.value;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al obtener elemento";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Crear un nuevo elemento
     * @param {Object} itemData - Datos del elemento
     */
    const createItem = async (itemData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await create(collection, itemData);
            const newItem = extractStrapiData(response);
            items.value = [...items.value, newItem];
            return newItem;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al crear elemento";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Actualizar un elemento
     * @param {number|string} id - ID del elemento
     * @param {Object} itemData - Datos a actualizar
     */
    const updateItem = async (id, itemData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await update(collection, id, itemData);
            const updatedItem = extractStrapiData(response);
            const index = items.value.findIndex(item => item.id === id);
            if (index !== -1) {
                items.value[index] = updatedItem;
            }
            return updatedItem;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al actualizar elemento";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Eliminar un elemento
     * @param {number|string} id - ID del elemento
     */
    const deleteItem = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            await remove(collection, id);
            items.value = items.value.filter(item => item.id !== id);
            return true;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al eliminar elemento";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Limpiar datos
     */
    const clear = () => {
        data.value = null;
        items.value = [];
        error.value = null;
        meta.value = null;
    };

    return {
        // Estado
        data: computed(() => data.value),
        items: computed(() => items.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        meta: computed(() => meta.value),
        // Métodos
        fetchAll,
        fetchById,
        createItem,
        updateItem,
        deleteItem,
        clear,
    };
}
