// Ejemplo de componente Vue que usa los servicios de Strapi

import { ref, onMounted } from 'vue';
import { useStrapiAuth } from '@/composables/useStrapiAuth';
import { useStrapiData } from '@/composables/useStrapiData';

export default {
    name: 'StrapiExample',
    setup() {
        // Autenticación
        const { user, isAuthenticated, login, logout } = useStrapiAuth();

        // Datos de una colección (ejemplo: 'articles')
        const { items, loading, error, fetchAll, createItem, deleteItem } = useStrapiData('articles');

        // Estado local
        const loginForm = ref({
            identifier: '',
            password: ''
        });

        const newArticle = ref({
            title: '',
            content: ''
        });

        // Cargar artículos al montar
        onMounted(async () => {
            if (isAuthenticated.value) {
                await fetchAll({ populate: '*' });
            }
        });

        // Métodos
        const handleLogin = async () => {
            try {
                await login(loginForm.value.identifier, loginForm.value.password);
                await fetchAll({ populate: '*' });
            } catch (err) {
                console.error('Error al iniciar sesión:', err);
            }
        };

        const handleLogout = () => {
            logout();
        };

        const handleCreateArticle = async () => {
            try {
                await createItem(newArticle.value);
                newArticle.value = { title: '', content: '' };
            } catch (err) {
                console.error('Error al crear artículo:', err);
            }
        };

        const handleDeleteArticle = async (id) => {
            try {
                await deleteItem(id);
            } catch (err) {
                console.error('Error al eliminar artículo:', err);
            }
        };

        return {
            // Auth
            user,
            isAuthenticated,
            loginForm,
            handleLogin,
            handleLogout,
            // Data
            items,
            loading,
            error,
            newArticle,
            handleCreateArticle,
            handleDeleteArticle
        };
    }
};
