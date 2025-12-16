<template>
  <BaseCard>
    <template #header>
      <h2 class="profile-edit-form__title">Editar Perfil</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="profile-edit-form">
      <AvatarUpload
        :current-avatar="currentAvatarUrl"
        @upload="handleAvatarUpload"
      />

      <BaseInput
        v-model="formData.phone"
        label="Teléfono"
        type="tel"
        placeholder="+57 300 123 4567"
        :error="errors.phone"
      />

      <div class="profile-edit-form__field">
        <label class="profile-edit-form__label">Biografía</label>
        <textarea
          v-model="formData.biography"
          class="profile-edit-form__textarea"
          :class="{ 'profile-edit-form__textarea--error': errors.biography }"
          placeholder="Cuéntanos sobre ti..."
          rows="5"
        ></textarea>
        <span v-if="errors.biography" class="profile-edit-form__error">
          {{ errors.biography }}
        </span>
      </div>

      <div v-if="error" class="profile-edit-form__alert">
        <span>⚠️</span>
        <span>{{ error }}</span>
      </div>

      <div class="profile-edit-form__actions">
        <BaseButton
          type="button"
          variant="secondary"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
        >
          Guardar Cambios
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import AvatarUpload from '@/components/profile/AvatarUpload.vue';
import { getStrapiURL } from '@/services/strapiService';

const props = defineProps({
  profile: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['submit', 'cancel', 'avatar-upload']);

const formData = ref({
  biography: '',
  phone: ''
});

const errors = ref({
  biography: '',
  phone: ''
});

const uploadedAvatar = ref(null);

const currentAvatarUrl = computed(() => {
  if (!props.profile?.avatar?.data?.attributes?.url) return '';
  return props.profile.avatar.data.attributes.url;
});

// Inicializar formulario con datos del perfil
watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    formData.value.biography = newProfile.biography || '';
    formData.value.phone = newProfile.phone || '';
  }
}, { immediate: true });

const validatePhone = () => {
  if (formData.value.phone && formData.value.phone.length < 7) {
    errors.value.phone = 'El teléfono debe tener al menos 7 dígitos';
    return false;
  }
  errors.value.phone = '';
  return true;
};

const validateBiography = () => {
  if (formData.value.biography && formData.value.biography.length > 500) {
    errors.value.biography = 'La biografía no debe superar 500 caracteres';
    return false;
  }
  errors.value.biography = '';
  return true;
};

const handleAvatarUpload = (file) => {
  uploadedAvatar.value = file;
  emit('avatar-upload', file);
};

const handleSubmit = () => {
  const isPhoneValid = validatePhone();
  const isBiographyValid = validateBiography();

  if (!isPhoneValid || !isBiographyValid) {
    return;
  }

  emit('submit', {
    biography: formData.value.biography,
    phone: formData.value.phone
  });
};
</script>

<style scoped>
.profile-edit-form__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-edit-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-edit-form__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.profile-edit-form__textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  color: #2d3748;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
}

.profile-edit-form__textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.profile-edit-form__textarea--error {
  border-color: #fc8181;
}

.profile-edit-form__error {
  font-size: 0.875rem;
  color: #c53030;
}

.profile-edit-form__alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  font-size: 0.875rem;
}

.profile-edit-form__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .profile-edit-form__actions {
    flex-direction: column-reverse;
  }
}
</style>
