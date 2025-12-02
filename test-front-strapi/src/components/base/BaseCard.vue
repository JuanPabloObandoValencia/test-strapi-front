<template>
  <div :class="['base-card', { 'base-card--glass': glass }]">
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header"></slot>
    </div>
    <div class="base-card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  glass: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.base-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.base-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.base-card--glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.base-card__header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.base-card__body {
  padding: 2rem;
}

.base-card__footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}
</style>
