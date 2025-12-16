<template>
  <div class="create-post-view">
    <div class="create-post-view__header">
      <h1 class="create-post-view__title">Crear Nuevo Post</h1>
      <router-link to="/dashboard" custom v-slot="{ navigate }">
        <BaseButton variant="secondary" @click="navigate">
          ← Volver al Dashboard
        </BaseButton>
      </router-link>
    </div>

    <div class="create-post-view__content">
      <BaseCard>
        <template #header>
          <h2 class="create-post-view__card-title">Información del Post</h2>
        </template>

        <form @submit.prevent="handleSubmit" class="create-post-form">
          <div class="create-post-form__field">
            <label for="title" class="create-post-form__label">
              Título <span class="create-post-form__required">*</span>
            </label>
            <BaseInput
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="Ingresa el título del post"
              :disabled="loading"
              required
            />
          </div>



          <div class="create-post-form__field">
            <label for="summary" class="create-post-form__label">
              Resumen
            </label>
             <textarea
              id="summary"
              v-model="formData.summary"
              class="create-post-form__textarea"
              placeholder="Breve descripción del artículo..."
              rows="3"
              :disabled="loading"
            ></textarea>
          </div>

          <div class="create-post-form__field">
            <label for="cover_image" class="create-post-form__label">
               Imagen de Portada
            </label>
            <div class="cover-image-upload">
                <input type="file" @change="handleFileChange" accept="image/*" />
                <div v-if="coverImagePreview" class="preview-container">
                    <img :src="coverImagePreview" alt="Preview" />
                    <button type="button" @click="removeCoverImage">Escoger otra</button>
                </div>
            </div>
          </div>

          <div class="create-post-form__row">
             <div class="create-post-form__field">
                <label for="category" class="create-post-form__label">Categoría</label>
                <select id="category" v-model="formData.category" class="create-post-form__select">
                   <option :value="null">Seleccionar...</option>
                   <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.attributes?.name || cat.name }}
                   </option>
                </select>
             </div>
             
             <div class="create-post-form__field">
                <label for="reading_time" class="create-post-form__label">Tiempo Lectura (min)</label>
                <input 
                  type="number" 
                  id="reading_time" 
                  v-model="formData.reading_time" 
                  class="create-post-form__input"
                  min="1" />
             </div>
          </div>

          <div class="create-post-form__field">
            <label class="create-post-form__label">
               Etiquetas
            </label>
            <div class="tags-checkboxes">
               <label v-for="tag in tags" :key="tag.id" class="tag-check">
                  <input type="checkbox" :value="tag.id" v-model="formData.tags">
                  {{ tag.attributes?.name || tag.name }}
               </label>
            </div>
          </div>

          <div class="create-post-form__field checkbox-field">
             <label class="checkbox-label">
                <input type="checkbox" v-model="formData.is_featured">
                Destacar este post
             </label>
          </div>

          <div class="create-post-form__field">
            <label for="content" class="create-post-form__label">
              Contenido <span class="create-post-form__required">*</span>
            </label>
            <textarea
              id="content"
              v-model="formData.content"
              class="create-post-form__textarea"
              placeholder="Escribe el contenido del post..."
              rows="8"
              :disabled="loading"
              required
            ></textarea>
          </div>


          
          <div class="create-post-form__field">
            <label for="published_date" class="create-post-form__label">
              Fecha de Publicación <span class="create-post-form__required">*</span>
            </label>
            <input
              id="published_date"
              v-model="formData.published_date"
              type="datetime-local"
              class="create-post-form__datetime"
              :disabled="loading"
              required
            />
          </div>

          <div v-if="error" class="create-post-form__error">
            {{ error }}
          </div>

          <div v-if="successMessage" class="create-post-form__success">
            {{ successMessage }}
          </div>

          <div class="create-post-form__actions">
            <BaseButton
              type="submit"
              variant="primary"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" size="small" />
              <span v-else>✓ Crear Post</span>
            </BaseButton>

            <router-link to="/dashboard" custom v-slot="{ navigate }">
              <BaseButton
                type="button"
                variant="secondary"
                @click="navigate"
                :disabled="loading"
              >
                Cancelar
              </BaseButton>
            </router-link>
          </div>
        </form>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createPost, getCategories, getTags, uploadFile, extractStrapiData } from '@/services/strapiService';
import { useStrapiAuth } from '@/composables/useStrapiAuth';
import { useStrapiProfile } from '@/composables/useStrapiProfile';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const router = useRouter();
const { user } = useStrapiAuth();
const { profile, loadProfile } = useStrapiProfile();

const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const categories = ref([]);
const tags = ref([]);
const coverImageFile = ref(null);
const coverImagePreview = ref('');


// Initialize form with current datetime
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
const formData = ref({
  title: '',
  summary: '',
  content: '',
  published_date: now.toISOString().slice(0, 16),
  reading_time: null,
  is_featured: false,
  category: null,
  tags: []
});

// Load resources on mount
const init = async () => {
    try {
        if (user.value?.id && !profile.value) {
           await loadProfile(user.value.id);
        }
        
        const [catsRes, tagsRes] = await Promise.all([getCategories(), getTags()]);
        categories.value = extractStrapiData(catsRes) || [];
        tags.value = extractStrapiData(tagsRes) || [];
        
    } catch (e) {
        console.error("Error loading form data", e);
    }
};
init();

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        coverImageFile.value = file;
        coverImagePreview.value = URL.createObjectURL(file);
    }
};

const removeCoverImage = () => {
    coverImageFile.value = null;
    coverImagePreview.value = '';
};

const handleSubmit = async () => {
  error.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    // Validate required fields
    if (!formData.value.title || !formData.value.content || !formData.value.published_date) {
      error.value = 'Por favor completa todos los campos requeridos';
      loading.value = false;
      return;
    }

    // Prepare post data
    const generateSlug = (text) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    };

    const postData = {
      title: formData.value.title,
      slug: generateSlug(formData.value.title),
      summary: formData.value.summary,
      content: formData.value.content,
      published_date: formData.value.published_date,
      reading_time: formData.value.reading_time,
      is_featured: formData.value.is_featured,
      // category: formData.value.category,
      // tags: formData.value.tags
    };

    // Add profile relation if available
    // if (profile.value?.id) {
    //   postData.profile = profile.value.id;
    // }

    // Handle Cover Image Upload
    if (coverImageFile.value) {
       const uploadedFiles = await uploadFile(coverImageFile.value);
       // Check if response is array or single object
       const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
       if (uploadedFile && uploadedFile.id) {
           postData.cover_image = uploadedFile.id;
       }
    }

    // Create the post
    // If we have images, upload them first


    await createPost(postData);

    successMessage.value = '¡Post creado exitosamente!';

    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

  } catch (err) {
    console.error('Error creating post:', err);
    error.value = err.response?.data?.error?.message || 'Error al crear el post. Por favor intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-post-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.create-post-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.create-post-view__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.create-post-view__content {
  max-width: 800px;
  margin: 0 auto;
}

.create-post-view__card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.create-post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.create-post-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.create-post-form__label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.create-post-form__required {
  color: #e53e3e;
}

.create-post-form__textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 150px;
}

.create-post-form__textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.create-post-form__textarea:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

.create-post-form__datetime {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.create-post-form__datetime:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.create-post-form__datetime:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

.create-post-form__error {
  padding: 1rem;
  background-color: #fff5f5;
  border: 1px solid #fc8181;
  border-radius: 8px;
  color: #c53030;
  font-size: 0.875rem;
}

.create-post-form__success {
  padding: 1rem;
  background-color: #f0fff4;
  border: 1px solid #68d391;
  border-radius: 8px;
  color: #22543d;
  font-size: 0.875rem;
  font-weight: 600;
}

.create-post-form__actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .create-post-view {
    padding: 1rem;
  }

  .create-post-view__header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .create-post-view__title {
    font-size: 1.5rem;
  }


  .create-post-form__actions {
    flex-direction: column;
  }
}


</style>

<style scoped>
/* Additional specific styles for new fields */
.create-post-form__row {
   display: flex;
   gap: 1rem;
}
.create-post-form__row > * {
   flex: 1;
}
.create-post-form__select, .create-post-form__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}
.cover-image-upload {
   margin-top: 0.5rem;
}
.preview-container {
   margin-top: 1rem;
   width: 200px;
}
.preview-container img {
   width: 100%;
   border-radius: 8px;
   display: block;
   margin-bottom: 0.5rem;
}
.tags-checkboxes {
   display: flex;
   flex-wrap: wrap;
   gap: 1rem;
   padding: 0.5rem;
   background: #f7fafc;
   border-radius: 8px;
}
.tag-check {
   display: flex;
   align-items: center;
   gap: 0.5rem;
   cursor: pointer;
}
.checkbox-field {
   margin-top: 0.5rem;
}
.checkbox-label {
   display: flex;
   align-items: center;
   gap: 0.5rem;
   font-weight: 600;
   cursor: pointer;
}
</style>
