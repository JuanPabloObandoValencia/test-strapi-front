<template>
  <BaseCard>
    <template #header>
      <div class="profile-card__header">
        <h2 class="profile-card__title">Mi Perfil</h2>
        <BaseButton variant="primary" @click="$emit('edit')">
          ✏️ Editar
        </BaseButton>
      </div>
    </template>

    <div class="profile-card__content">
      <div class="profile-card__avatar-section">
        <div class="profile-card__avatar">
          <img 
            v-if="avatarUrl" 
            :src="avatarUrl" 
            :alt="`Avatar de ${user?.username}`"
          />
          <div v-else class="profile-card__avatar-placeholder">
            {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
        </div>
        <h3 class="profile-card__username">{{ user?.username }}</h3>
        <p class="profile-card__email">{{ user?.email }}</p>
      </div>

      <div class="profile-card__details">
        <div class="profile-card__detail">
          <span class="profile-card__label">📱 Teléfono:</span>
          <span class="profile-card__value">{{ profile?.phone || 'No especificado' }}</span>
        </div>

        <div class="profile-card__detail profile-card__detail--full">
          <span class="profile-card__label">📝 Biografía:</span>
          <p class="profile-card__biography">
            {{ profile?.biography || 'No hay biografía disponible' }}
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { getStrapiURL } from '@/services/strapiService';

const props = defineProps({
  profile: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    required: true
  }
});

defineEmits(['edit']);

const avatarUrl = computed(() => {
  if (!props.profile?.avatar?.data?.attributes?.url) return '';
  return getStrapiURL(props.profile.avatar.data.attributes.url);
});
</script>

<style scoped>
.profile-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.profile-card__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card__avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
}

.profile-card__avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.profile-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-card__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 4rem;
  font-weight: 700;
}

.profile-card__username {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.profile-card__email {
  margin: 0;
  font-size: 1rem;
  color: #718096;
}

.profile-card__details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card__detail {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-card__detail--full {
  flex: 1;
}

.profile-card__label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-card__value {
  color: #2d3748;
  font-size: 1rem;
}

.profile-card__biography {
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .profile-card__header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .profile-card__avatar {
    width: 120px;
    height: 120px;
  }

  .profile-card__avatar-placeholder {
    font-size: 3rem;
  }
}
</style>
