# Configuración de Strapi con Vue 3

Esta guía te ayudará a conectar tu aplicación Vue 3 con un backend de Strapi.

## 📋 Requisitos Previos

- Node.js instalado
- Backend de Strapi corriendo (por defecto en `http://localhost:1337`)
- Vue 3 + Vite

## 🚀 Configuración Inicial

### 1. Variables de Entorno

El archivo `.env` ya está configurado con:

```env
VITE_API_URL=http://localhost:1337/api
```

Si tu backend de Strapi está en otra URL, modifica este valor.

### 2. Estructura del Proyecto

```
src/
├── services/
│   ├── api.js              # Cliente axios configurado
│   └── strapiService.js    # Servicios helper para Strapi
├── composables/
│   ├── useStrapiAuth.js    # Composable de autenticación
│   └── useStrapiData.js    # Composable para datos CRUD
```

## 💡 Uso

### Autenticación

```vue
<script setup>
import { useStrapiAuth } from '@/composables/useStrapiAuth';

const { user, isAuthenticated, loading, error, login, register, logout } = useStrapiAuth();

// Iniciar sesión
const handleLogin = async () => {
  try {
    await login('usuario@email.com', 'password123');
    console.log('Usuario autenticado:', user.value);
  } catch (err) {
    console.error('Error:', error.value);
  }
};

// Registrar usuario
const handleRegister = async () => {
  try {
    await register('username', 'email@example.com', 'password123');
  } catch (err) {
    console.error('Error:', error.value);
  }
};

// Cerrar sesión
const handleLogout = () => {
  logout();
};
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Bienvenido, {{ user.username }}</p>
    <button @click="handleLogout">Cerrar Sesión</button>
  </div>
  <div v-else>
    <button @click="handleLogin" :disabled="loading">Iniciar Sesión</button>
  </div>
</template>
```

### Operaciones CRUD

```vue
<script setup>
import { onMounted } from 'vue';
import { useStrapiData } from '@/composables/useStrapiData';

// Usar composable para una colección específica
const { items, loading, error, fetchAll, createItem, updateItem, deleteItem } = useStrapiData('articles');

// Cargar datos al montar
onMounted(async () => {
  await fetchAll({
    populate: '*',
    sort: 'createdAt:desc',
    pagination: {
      page: 1,
      pageSize: 10
    }
  });
});

// Crear nuevo artículo
const createArticle = async () => {
  await createItem({
    title: 'Mi Artículo',
    content: 'Contenido del artículo',
  });
};

// Actualizar artículo
const updateArticle = async (id) => {
  await updateItem(id, {
    title: 'Título Actualizado',
  });
};

// Eliminar artículo
const deleteArticle = async (id) => {
  await deleteItem(id);
};
</script>

<template>
  <div>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="article in items" :key="article.id">
        <h3>{{ article.title }}</h3>
        <p>{{ article.content }}</p>
        <button @click="updateArticle(article.id)">Editar</button>
        <button @click="deleteArticle(article.id)">Eliminar</button>
      </div>
    </div>
    <button @click="createArticle">Crear Artículo</button>
  </div>
</template>
```

### Uso Directo del Servicio

Si prefieres no usar composables:

```javascript
import strapiService from '@/services/strapiService';

// Obtener todos los artículos
const articles = await strapiService.getAll('articles', {
  populate: '*'
});

// Obtener un artículo específico
const article = await strapiService.getById('articles', 1, {
  populate: '*'
});

// Crear artículo
const newArticle = await strapiService.create('articles', {
  title: 'Nuevo Artículo',
  content: 'Contenido...'
});

// Actualizar artículo
const updated = await strapiService.update('articles', 1, {
  title: 'Título Actualizado'
});

// Eliminar artículo
await strapiService.remove('articles', 1);
```

### Subir Archivos

```vue
<script setup>
import { uploadFile } from '@/services/strapiService';

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  try {
    const uploadedFile = await uploadFile(file);
    console.log('Archivo subido:', uploadedFile);
  } catch (error) {
    console.error('Error al subir archivo:', error);
  }
};
</script>

<template>
  <input type="file" @change="handleFileUpload" />
</template>
```

### Mostrar Imágenes de Strapi

```vue
<script setup>
import { getStrapiURL } from '@/services/strapiService';

const imageUrl = getStrapiURL('/uploads/imagen_123.jpg');
</script>

<template>
  <img :src="imageUrl" alt="Imagen desde Strapi" />
</template>
```

## 🔧 Configuración Avanzada

### Filtros y Ordenamiento

```javascript
await fetchAll({
  filters: {
    title: {
      $contains: 'Vue'
    },
    publishedAt: {
      $notNull: true
    }
  },
  sort: ['createdAt:desc'],
  populate: '*'
});
```

### Paginación

```javascript
await fetchAll({
  pagination: {
    page: 1,
    pageSize: 25
  }
});
```

### Relaciones (Populate)

```javascript
// Poblar todas las relaciones
await fetchAll({ populate: '*' });

// Poblar relaciones específicas
await fetchAll({
  populate: ['author', 'categories', 'cover']
});

// Poblar relaciones anidadas
await fetchAll({
  populate: {
    author: {
      populate: ['avatar']
    }
  }
});
```

## 🔐 Autenticación JWT

El token JWT se guarda automáticamente en `localStorage` al iniciar sesión y se incluye en todas las peticiones subsecuentes mediante interceptores de axios.

## 🌐 Proxy de Desarrollo

Vite está configurado con un proxy para evitar problemas de CORS durante el desarrollo. Las peticiones a `/api` se redirigen automáticamente a `http://localhost:1337`.

## 📝 Notas Importantes

1. **Formato de Datos Strapi v4**: El servicio incluye la función `extractStrapiData()` que convierte automáticamente el formato de respuesta de Strapi v4 a un formato más simple.

2. **Manejo de Errores**: Todos los métodos incluyen manejo de errores. Los errores se capturan y se pueden acceder mediante la propiedad `error` en los composables.

3. **Estados de Carga**: Los composables incluyen estados de carga (`loading`) para mostrar indicadores visuales durante las peticiones.

## 🐛 Solución de Problemas

### Error de CORS
Si experimentas problemas de CORS, asegúrate de que:
- El backend de Strapi esté corriendo
- La configuración de CORS en Strapi permita tu dominio
- El proxy de Vite esté configurado correctamente

### Token Expirado
Si el token JWT expira, el interceptor lo detectará y limpiará automáticamente el `localStorage`. Puedes descomentar la línea de redirección en `api.js` para redirigir al login automáticamente.

## 📚 Recursos

- [Documentación de Strapi](https://docs.strapi.io/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Axios Documentation](https://axios-http.com/)
