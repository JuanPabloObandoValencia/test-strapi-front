<template>
  <div class="doc-detail">
    <div v-if="loading" class="loading-state">
       <LoadingSpinner size="large" />
    </div>
    
    <!-- <div v-else-if="error" class="error-container">
       <h1>Error 404</h1>
       <p>No se encontró el artículo.</p>
       <router-link to="/docs">Volver a la documentación</router-link>
    </div> -->

    <template v-else-if="post">
      <!-- Article Header -->
      <header class="doc-header">
        <div class="container">
           <div class="doc-header__meta">
              <router-link to="/docs" class="back-link">← Volver</router-link>
              <span class="meta-separator">•</span>
              <span class="category-tag" v-if="post.category?.data">
                 {{ post.category.data.attributes?.name }}
              </span>
           </div>
           
           <h1 class="doc-title">{{ post.title || post.tittle }}</h1>
           
           <div class="doc-info">
              <div class="author" v-if="post.profile?.data">
                 <img v-if="post.profile.data.attributes?.avatar?.data" 
                      :src="getStrapiURL(post.profile.data.attributes.avatar.data.attributes.url)" 
                      class="author-avatar" />
                 <span class="author-name">{{ post.profile.data.attributes?.biography || 'Autor' }}</span>
              </div>
              <span class="info-date">{{ formatDate(post.published_date) }}</span>
              <span class="info-read">{{ post.reading_time ? post.reading_time + ' min lectura' : '' }}</span>
           </div>
        </div>
      </header>
      
      <div class="container doc-layout">
         <!-- Content Column -->
         <article class="doc-main">
            <div class="doc-cover" v-if="post.cover_image?.data || post.image?.data">
                <img :src="getStrapiURL((post.cover_image?.data?.attributes?.url || post.cover_image?.data?.url) || (post.image?.data?.attributes?.url || post.image?.data?.url))" alt="Cover" />
            </div>

            <!-- Summary / Intro -->
            <div class="doc-summary" v-if="post.summary">
               <p>{{ post.summary }}</p>
            </div>
            
            <div class="markdown-body" v-html="renderedContent"></div>

            <!-- Tags Footer -->
            <div class="doc-tags" v-if="post.tags?.data && post.tags.data.length > 0">
               <span class="tags-label">Etiquetas:</span>
               <div class="tags-list">
                  <span v-for="tag in post.tags.data" :key="tag.id" class="tag-chip">
                     #{{ tag.attributes?.name || tag.name }}
                  </span>
               </div>
            </div>
         </article>

         <!-- Sidebar (TOC) -->
         <aside class="doc-sidebar">
            <div class="toc-sticky">
               <h3 class="toc-title">En esta página</h3>
               <nav class="toc-nav">
                  <ul v-if="tocItems.length > 0">
                     <li v-for="(item, idx) in tocItems" :key="idx" :class="`toc-level-${item.level}`">
                        <a :href="`#${item.slug}`" @click.prevent="scrollTo(item.slug)">{{ item.text }}</a>
                     </li>
                  </ul>
                  <p v-else class="toc-empty">Sin índice</p>
               </nav>
            </div>
         </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getPostBySlug, getPostById, getStrapiURL, extractStrapiData } from '@/services/strapiService';
import { marked } from 'marked';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
   await loadData();
});

watch(() => route.params.slug, async (newSlug) => {
   if(newSlug) await loadData();
});

const loadData = async () => {
   loading.value = true;
   error.value = null;
   try {
      const slug = route.params.slug;
      if (!slug) throw new Error("No slug provided");
      
      const response = await getPostBySlug(slug);
      let data = extractStrapiData(response);
      console.log("Slug lookup result:", data);
      
      // If array is returned (from filtering), grab first item
      if (Array.isArray(data)) {
          if (data.length > 0) {
            post.value = data[0];
          } else {
            // SLUG LOOKUP FAILED
            console.log("Slug lookup empty, trying ID fallback for:", slug);
            // If slug looks like a number, try fetching by ID
            if (!isNaN(slug)) {
                try {
                    const idResponse = await getPostById(slug);
                    const idData = extractStrapiData(idResponse);
                    console.log("ID lookup result:", idData);
                    if (idData) {
                        post.value = idData;
                    }
                } catch (err) {
                     // ID lookup also failed
                     console.error("Fallback ID lookup failed", err);
                }
            }
          }
      } else {
          // Single object returned
          post.value = data;
      }

      if (!post.value) error.value = "Post not found";
      
   } catch (e) {
      error.value = e.message;
      console.error(e);
   } finally {
      loading.value = false;
   }
};

const renderedContent = computed(() => {
   if (!post.value?.content) return '';
   // Process markdown to HTML
   // Add IDs to headers for anchor links if relying on generated html
   const renderer = new marked.Renderer();
   renderer.heading = (text, level) => {
      const slug = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${slug}">${text}</h${level}>`;
   };
   
   return marked(post.value.content, { renderer });
});

// Generate TOC from table_of_contents JSON or fallback content analysis depends on schema
// Assuming user schema has table_of_contents as JSON
const tocItems = computed(() => {
    if (post.value?.table_of_contents) {
        // If it's stored in DB
        return post.value.table_of_contents;
    }
    // Simple fallback parsing from content (simulated) for now if DB field is empty
    return [];
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date(dateString));
};

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without scroll
        history.pushState(null, null, `#${id}`);
    }
}
</script>

<style scoped>
.doc-detail {
  min-height: 100vh;
  background: white;
  color: #334155;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.doc-header {
  background: #f8fafc;
  padding: 4rem 0 3rem;
  border-bottom: 1px solid #e2e8f0;
}

.doc-header__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.back-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.category-tag {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: #475569;
}

.doc-title {
  font-size: 3rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 2rem;
}

.doc-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 0.95rem;
  color: #64748b;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #334155;
  font-weight: 500;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.doc-layout {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 4rem;
  padding-top: 4rem;
  padding-bottom: 6rem;
}

.doc-main {
  min-width: 0; /* Prevent overflow */
}

.doc-cover {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  aspect-ratio: 16/9;
}

.doc-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doc-summary {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #475569;
  font-weight: 500;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.doc-tags {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.tags-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-chip {
  background: #f1f5f9;
  color: #475569;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.tag-chip:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* Typography for Markdown Content */
.markdown-body {
  line-height: 1.8;
  font-size: 1.125rem;
}

:deep(.markdown-body h2) {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  scroll-margin-top: 2rem;
}

:deep(.markdown-body h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-top: 2rem;
  margin-bottom: 1rem;
  scroll-margin-top: 2rem;
}

:deep(.markdown-body p) {
  margin-bottom: 1.5rem;
}

:deep(.markdown-body ul) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

:deep(.markdown-body img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1.5rem 0;
}

/* Sidebar TOC */
.doc-sidebar {
  position: relative;
}

.toc-sticky {
  position: sticky;
  top: 2rem;
}

.toc-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  border-left: 1px solid #e2e8f0;
}

.toc-nav li {
  margin-bottom: 0;
}

.toc-nav a {
  display: block;
  text-decoration: none;
  font-size: 0.9rem;
  color: #64748b;
  padding: 0.5rem 0 0.5rem 1rem;
  border-left: 2px solid transparent;
  margin-left: -2px;
  transition: all 0.2s;
}

.toc-nav a:hover {
  color: #3b82f6;
  border-left-color: #3b82f6;
}

.toc-level-2 { font-weight: 500; }
.toc-level-3 { padding-left: 2rem; font-size: 0.85rem; }

@media (max-width: 1024px) {
  .doc-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .doc-sidebar {
    display: none; /* Hide TOC on mobile for now */
  }
}
</style>
