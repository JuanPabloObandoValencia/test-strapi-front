<template>
  <div class="docs-list">
    <!-- Hero Section -->
    <header class="docs-hero">
      <div class="container">
        <h1 class="docs-hero__title">Documentación</h1>
        <p class="docs-hero__subtitle">Encuentra guías, tutoriales y referencias técnicas.</p>
        
        <div class="docs-search">
           <input 
             type="text" 
             v-model="searchQuery" 
             placeholder="Buscar en la documentación..." 
             class="docs-search__input"
             @input="handleSearch"
           />
           <span class="docs-search__icon">🔍</span>
        </div>
      </div>
    </header>

    <div class="container docs-content">
       <aside class="docs-sidebar">
          <h3 class="docs-sidebar__title">Categorías</h3>
          <ul class="docs-nav">
             <li><a href="#" class="active">Todas</a></li>
             <!-- Categories would be dynamic locally or fetched -->
             <li><a href="#">Guías</a></li>
             <li><a href="#">API Reference</a></li>
             <li><a href="#">Tutoriales</a></li>
          </ul>
       </aside>

       <main class="docs-grid">
         <LoadingSpinner v-if="loading" />
         <div v-else-if="error" class="error-msg">{{ error }}</div>
         <div v-else-if="filteredPosts.length === 0" class="empty-msg">No se encontraron artículos.</div>
         
         <article v-else v-for="post in filteredPosts" :key="post.id" class="doc-card">
            <router-link :to="{ name: 'DocDetail', params: { slug: post.slug || post.id } }" class="doc-card__link">
               <div class="doc-card__cover" v-if="post.cover_image?.data || post.image?.data">
                  <img :src="getStrapiURL((post.cover_image?.data?.attributes?.url || post.cover_image?.data?.url) || (post.image?.data?.attributes?.url || post.image?.data?.url))" alt="Cover" />
               </div>
               <div class="doc-card__body">
                  <div class="doc-card__meta" v-if="post.category?.data">
                     <span class="doc-badge">{{ post.category.data.attributes?.name || 'General' }}</span>
                     <span class="doc-read-time" v-if="post.reading_time">{{ post.reading_time }} min lectura</span>
                  </div>
                  <h2 class="doc-card__title">{{ post.title || post.tittle }}</h2>
                  <p class="doc-card__summary">{{ post.summary || truncateContent(post.content) }}</p>
               </div>
            </router-link>
         </article>
       </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStrapiData } from '@/composables/useStrapiData';
import { getStrapiURL } from '@/services/strapiService';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const { items: posts, loading, error, fetchAll } = useStrapiData('posts');
const searchQuery = ref('');

onMounted(async () => {
  await fetchAll({
    populate: ['category', 'tags', 'cover_image'],
    sort: 'published_date:desc'
  });
});

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value;
  const q = searchQuery.value.toLowerCase();
  return posts.value.filter(post => 
     (post.title || post.tittle)?.toLowerCase().includes(q) || 
     (post.summary || post.content)?.toLowerCase().includes(q)
  );
});

const truncateContent = (content, length = 150) => {
    if (!content) return '';
    return content.length > length ? content.substring(0, length) + '...' : content;
};
</script>

<style scoped>
.docs-list {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.docs-hero {
  background: white;
  padding: 4rem 0;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.docs-hero__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
}

.docs-hero__subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2.5rem;
}

.docs-search {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.docs-search__input {
  width: 100%;
  padding: 1rem 1.5rem;
  padding-left: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.125rem;
  transition: all 0.2s;
}

.docs-search__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.docs-search__icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.docs-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 3rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.docs-sidebar__title {
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 1rem;
}

.docs-nav {
  list-style: none;
  padding: 0;
}

.docs-nav li {
  margin-bottom: 0.5rem;
}

.docs-nav a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.docs-nav a:hover, .docs-nav a.active {
  background-color: #e2e8f0;
  color: #0f172a;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.doc-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.doc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.doc-card__link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.doc-card__cover {
  height: 160px;
  overflow: hidden;
  background: #f1f5f9;
}

.doc-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doc-card__body {
  padding: 1.5rem;
}

.doc-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.doc-badge {
  background: #eff6ff;
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
}

.doc-read-time {
  color: #94a3b8;
}

.doc-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.doc-card__summary {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .docs-content {
    grid-template-columns: 1fr;
  }
  .docs-sidebar {
    display: none; /* Mobile menu needed logic elsewhere */
  }
}
</style>
