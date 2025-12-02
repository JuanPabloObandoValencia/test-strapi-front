<template>
  <div :class="['loading-spinner', `loading-spinner--${size}`]">
    <div class="loading-spinner__circle"></div>
    <p v-if="text" class="loading-spinner__text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  text: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner__circle {
  border-radius: 50%;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  animation: spin 0.8s linear infinite;
}

.loading-spinner--small .loading-spinner__circle {
  width: 24px;
  height: 24px;
}

.loading-spinner--medium .loading-spinner__circle {
  width: 40px;
  height: 40px;
}

.loading-spinner--large .loading-spinner__circle {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.loading-spinner__text {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
