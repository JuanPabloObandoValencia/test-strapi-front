<template>
  <div class="avatar-upload">
    <div 
      class="avatar-upload__dropzone"
      :class="{ 'avatar-upload__dropzone--dragging': isDragging }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
    >
      <div v-if="previewUrl || currentAvatar" class="avatar-upload__preview">
        <img :src="previewUrl || currentAvatar" alt="Avatar preview" />
        <div class="avatar-upload__overlay">
          <span>📷</span>
          <span>Cambiar foto</span>
        </div>
      </div>
      <div v-else class="avatar-upload__placeholder">
        <span class="avatar-upload__icon">📸</span>
        <p class="avatar-upload__text">
          Arrastra una imagen aquí o haz clic para seleccionar
        </p>
        <p class="avatar-upload__hint">PNG, JPG hasta 5MB</p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="avatar-upload__input"
      @change="handleFileSelect"
    />

    <div v-if="error" class="avatar-upload__error">
      <span>⚠️</span>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getStrapiURL } from '@/services/strapiService';

const props = defineProps({
  currentAvatar: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  }
});

const emit = defineEmits(['upload']);

const fileInput = ref(null);
const selectedFile = ref(null);
const previewUrl = ref('');
const isDragging = ref(false);
const error = ref('');

const currentAvatar = computed(() => {
  if (!props.currentAvatar) return '';
  return getStrapiURL(props.currentAvatar);
});

const validateFile = (file) => {
  error.value = '';

  if (!file.type.startsWith('image/')) {
    error.value = 'Por favor selecciona una imagen válida';
    return false;
  }

  if (file.size > props.maxSize) {
    error.value = `La imagen no debe superar ${props.maxSize / 1024 / 1024}MB`;
    return false;
  }

  return true;
};

const processFile = (file) => {
  if (!validateFile(file)) return;

  selectedFile.value = file;

  // Crear preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // Emitir el archivo para que el componente padre lo maneje
  emit('upload', file);
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    processFile(file);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};
</script>

<style scoped>
.avatar-upload {
  width: 100%;
}

.avatar-upload__dropzone {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border: 3px dashed #cbd5e0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.avatar-upload__dropzone:hover {
  border-color: #667eea;
  transform: scale(1.02);
}

.avatar-upload__dropzone--dragging {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: scale(1.05);
}

.avatar-upload__preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.avatar-upload__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.avatar-upload__preview:hover .avatar-upload__overlay {
  opacity: 1;
}

.avatar-upload__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  text-align: center;
}

.avatar-upload__icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.avatar-upload__text {
  font-size: 0.875rem;
  color: #4a5568;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
}

.avatar-upload__hint {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
}

.avatar-upload__input {
  display: none;
}

.avatar-upload__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
