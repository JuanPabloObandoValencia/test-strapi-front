import { ref, computed } from "vue";
import { getProfile, createProfile, updateProfile, uploadAvatar } from "@/services/strapiService";

// Shared state (singleton pattern)
const profile = ref(null);
const loading = ref(false);
const error = ref(null);

/**
 * Composable para manejo de perfiles de usuario
 * @returns {Object} Funciones y estado del perfil
 */
export function useStrapiProfile() {
    /**
     * Cargar perfil del usuario
     * @param {number|string} userId - ID del usuario
     */
    const loadProfile = async (userId) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await getProfile(userId);
            const items = response.data?.data;
            if (items && items.length > 0) {
                profile.value = {
                    id: items[0].id,
                    ...items[0].attributes
                };
            } else {
                profile.value = null;
            }
            return profile.value;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al cargar el perfil";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Crear nuevo perfil
     * @param {number|string} userId - ID del usuario
     * @param {Object} profileData - Datos del perfil
     */
    const create = async (userId, profileData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await createProfile(userId, profileData);
            profile.value = {
                id: response.data.id,
                ...response.data.attributes
            };
            return profile.value;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al crear el perfil";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Actualizar perfil existente
     * @param {number|string} profileId - ID del perfil
     * @param {Object} profileData - Datos a actualizar
     */
    const update = async (profileId, profileData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await updateProfile(profileId, profileData);
            profile.value = {
                id: response.data.id,
                ...response.data.attributes
            };
            return profile.value;
        } catch (err) {
            error.value = err.response?.data?.error?.message || "Error al actualizar el perfil";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Subir avatar
     * @param {File} file - Archivo de imagen
     * @param {number|string} profileId - ID del perfil
     */
    const uploadProfileAvatar = async (file, profileId) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await uploadAvatar(file, profileId);

            // Forzar recarga del perfil usando el UI original desde el profile actual
            let userId = null;

            // Strapi devuelve el user así:
            // users_permissions_user: { data: { id } }
            if (profile.value?.users_permissions_user?.data?.id) {
                userId = profile.value.users_permissions_user.data.id;
            }

            if (userId) {
                await loadProfile(userId);
            }

            return response;

        } catch (err) {
            error.value =
                err.response?.data?.error?.message || "Error al subir el avatar";
            throw err;

        } finally {
            loading.value = false;
        }
    };


    /**
     * Limpiar estado del perfil
     */
    const clearProfile = () => {
        profile.value = null;
        error.value = null;
    };

    return {
        profile: computed(() => profile.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        loadProfile,
        create,
        update,
        uploadProfileAvatar,
        clearProfile,
    };
}
