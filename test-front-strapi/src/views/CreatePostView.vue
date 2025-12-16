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
import { createPost } from '@/services/strapiService';
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


// Initialize form with current datetime
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
const formData = ref({
  title: '',
  content: '',
  published_date: now.toISOString().slice(0, 16)
});

// Load user profile on mount
if (user.value?.id && !profile.value) {
  loadProfile(user.value.id);
}

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
      content: formData.value.content,
      published_date: formData.value.published_date,
    };

    // Add profile relation if available
    if (profile.value?.id) {
      postData.profile = profile.value.id;
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
