<template>
  <div class="posts-view">
    <div class="posts-view__header">
      <h1 class="posts-view__title">Publicaciones</h1>
      <div class="posts-view__actions">
        <router-link to="/posts/create" custom v-slot="{ navigate }">
          <BaseButton variant="success" @click="navigate">
            ✏️ Crear Post
          </BaseButton>
        </router-link>
        <router-link to="/dashboard" custom v-slot="{ navigate }">
          <BaseButton variant="secondary" @click="navigate">
            ← Dashboard
          </BaseButton>
        </router-link>
      </div>
    </div>

    <div class="posts-view__content">
      <LoadingSpinner v-if="loading" size="large" text="Cargando posts..." class="posts-view__loader" />

      <div v-else-if="error" class="posts-view__error">
        {{ error }}
      </div>

      <div v-else-if="posts.length === 0" class="posts-view__empty">
        <p>No hay publicaciones aún.</p>
        <router-link to="/posts/create">¡Sé el primero en escribir algo!</router-link>
      </div>

      <div v-else class="posts-grid">
        <BaseCard v-for="post in posts" :key="post.id" class="post-card">
          <template #header>
            <!-- Post Thumbnail (if available) -->
            <div class="post-card__thumbnail" v-if="getPostThumbnail(post)">
              <img :src="getStrapiURL(getPostThumbnail(post).url)" :alt="post.title" />
            </div>
            <div class="post-card__header">
              <h2 class="post-card__title">{{ post.tittle }}</h2>
              <span class="post-card__date">{{ formatDate(post.published_date) }}</span>
            </div>
          </template>
          
          <div class="post-card__content">
            <p>{{ truncateContent(post.content) }}</p>
          </div>

          <div class="post-card__footer">
             <div class="post-actions">
                <BaseButton variant="secondary" size="small" @click="openPostModal(post)">
                  📖 Leer más
                </BaseButton>
             </div>
             
             <div class="post-author" v-if="post.profile">
              <span class="post-author__avatar">
                {{ getAuthorInitial(post.profile) }}
              </span>
              <span class="post-author__name">
                {{ getAuthorName(post.profile) }}
              </span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <BaseModal 
      :show="showModal" 
      :title="selectedPost?.tittle || 'Detalle del Post'" 
      @close="closePostModal"
    >
        <div class="post-modal-content">
          <!-- Image Gallery -->
          <div class="post-gallery" v-if="selectedPost.image && (selectedPost.image.data || (Array.isArray(selectedPost.image) && selectedPost.image.length))">
             <div v-for="img in getPostImages(selectedPost)" :key="img.id" class="gallery-item">
               <img :src="getStrapiURL(img.url)" :alt="selectedPost.tittle" />
             </div>
          </div>

          <div class="post-meta">
             <span class="post-meta__date">📅 {{ formatDate(selectedPost.published_date) }}</span>
           <span class="post-meta__author" v-if="selectedPost.profile">
             ✍️ {{ getAuthorName(selectedPost.profile) }}
           </span>
        </div>
        
        <div class="post-body">
          {{ selectedPost.content }}
        </div>
      </div>
      
      <template #footer>
         <BaseButton variant="secondary" @click="closePostModal">
            Cerrar
         </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStrapiData } from '@/composables/useStrapiData';
import { getStrapiURL } from '@/services/strapiService';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import BaseModal from '@/components/base/BaseModal.vue';

const { items: posts, loading, error, fetchAll } = useStrapiData('posts');

const showModal = ref(false);
const selectedPost = ref(null);

const openPostModal = (post) => {
  selectedPost.value = post;
  showModal.value = true;
};

const closePostModal = () => {
  showModal.value = false;
  selectedPost.value = null;
};

onMounted(async () => {
  await fetchAll({
    populate: {
      profile: {
        populate: ['avatar']
      },
      image: '*'
    },
    sort: 'published_date:desc'
  });
});

const getPostImages = (post) => {
  if (!post.image) return [];
  // Handle Strapi v4 nested data vs v5 flat structure
  if (Array.isArray(post.image)) return post.image;
  if (post.image.data) return post.image.data.map(img => img.attributes ? { id: img.id, ...img.attributes } : img);
  return [];
};

const getPostThumbnail = (post) => {
  const images = getPostImages(post);
  return images.length > 0 ? images[0] : null;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const truncateContent = (content) => {
  if (!content) return '';
  return content.length > 150 ? content.substring(0, 150) + '...' : content;
};

const getAuthorInitial = (profile) => {
  // Handle both flat (Strapi v5) and nested (Strapi v4) structures
  const attributes = profile.attributes || profile; // If structure has attributes, use it, else use profile directly
  if (attributes && attributes.biography) {
      return attributes.biography.charAt(0).toUpperCase();
  }
  return 'U';
};

const getAuthorName = (profile) => {
  const attributes = profile.attributes || profile;
  return attributes.biography || 'Usuario';
};
</script>

<style scoped>
.posts-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.posts-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.posts-view__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.posts-view__actions {
  display: flex;
  gap: 1rem;
}

.posts-view__content {
  max-width: 1200px;
  margin: 0 auto;
}

.posts-view__loader {
  margin-top: 4rem;
}

.posts-view__error {
  background-color: #fff5f5;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.posts-view__empty {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  margin-top: 3rem;
}

.posts-view__empty a {
  color: #fbbf24;
  text-decoration: none;
  font-weight: bold;
}

.posts-view__empty a:hover {
  text-decoration: underline;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.post-card__title {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.post-card__date {
  font-size: 0.875rem;
  color: #718096;
  white-space: nowrap;
}

.post-card__content {
  color: #4a5568;
  line-height: 1.6;
  flex: 1;
}

.post-card__footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #718096;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 1rem;
}

.post-body {
  white-space: pre-wrap; /* Preserves newlines and wraps text */
  font-size: 1.05rem;
  color: #2d3748;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.post-author__avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.post-author__name {
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .posts-view__header {
    flex-direction: column;
    gap: 1rem;
  }
}
.post-card__thumbnail {
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
  margin: -1.5rem -1.5rem 1rem -1.5rem; /* Cancel out padding */
  border-radius: 12px 12px 0 0;
}

.post-card__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-card__thumbnail img {
  transform: scale(1.05);
}

.post-gallery {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.gallery-item {
  flex: 0 0 auto;
  width: 100%;
  max-width: 400px; /* Or whatever generic size fits nicely */
  border-radius: 8px;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
}

@media (min-width: 600px) {
    .gallery-item {
        width: 80%;
    }
}
</style>
