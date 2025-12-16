<template>
  <div class="profile-view">
    <div class="profile-view__header">
      <h1 class="profile-view__title">Perfil de Usuario</h1>
      <router-link to="/dashboard" custom v-slot="{ navigate }">
        <BaseButton variant="secondary" @click="navigate">
          ← Volver al Dashboard
        </BaseButton>
      </router-link>
    </div>

    <div class="profile-view__content">
      
      <LoadingSpinner v-if="loading && !profile" size="large" text="Cargando perfil..." />

      <div v-else-if="!isEditing">
        <ProfileCard
          :profile="profile"
          :user="user"
          @edit="isEditing = true"
        />
      </div>

      <div v-else>
        <ProfileEditForm
          :profile="profile"
          :loading="loading"
          :error="error"
          @submit="handleSubmit"
          @cancel="handleCancel"
          @avatar-upload="handleAvatarUpload"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStrapiAuth } from '@/composables/useStrapiAuth';
import { useStrapiProfile } from '@/composables/useStrapiProfile';
import BaseButton from '@/components/base/BaseButton.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue';

const { user } = useStrapiAuth();
const { profile, loading, error, loadProfile, create, update, uploadProfileAvatar } = useStrapiProfile();

const isEditing = ref(false);
const pendingAvatar = ref(null);

onMounted(async () => {
  if (user.value?.id) {
    await loadProfile(user.value.id);
    console.log('profile', profile.value);
  }
});

const handleCancel = () => {
  isEditing.value = false;
  pendingAvatar.value = null;
};

const handleAvatarUpload = (file) => {
  pendingAvatar.value = file;
};

const handleSubmit = async (formData) => {
  try {
    let savedProfile;

    // Crear o actualizar perfil
    if (profile.value) {
      savedProfile = await update(profile.value.id, formData);
    } else {
      savedProfile = await create(user.value.id, formData);
    }

    // Subir avatar si hay uno pendiente
    if (pendingAvatar.value && savedProfile) {
      await uploadProfileAvatar(pendingAvatar.value, savedProfile.id);
    }

    // Salir del modo edición
    isEditing.value = false;
    pendingAvatar.value = null;

    // Recargar perfil para obtener datos actualizados
    await loadProfile(user.value.id);
  } catch (err) {
    console.error('Error al guardar perfil:', err);
  }
};
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.profile-view__header {
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

.profile-view__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-view__content {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 1rem;
  }

  .profile-view__header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .profile-view__title {
    font-size: 1.5rem;
  }
}
</style>
