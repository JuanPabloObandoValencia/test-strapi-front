<script setup>
import { computed } from 'vue';
import { useStrapiAuth } from '@/composables/useStrapiAuth';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';

const { isAuthenticated } = useStrapiAuth();

const currentView = computed(() => {
  return isAuthenticated.value ? DashboardView : LoginView;
});
</script>

<template>
  <div id="app">
    <transition name="view-fade" mode="out-in">
      <component :is="currentView" />
    </transition>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.view-fade-enter-active,
.view-fade-leave-active {
  transition: all 0.3s ease;
}

.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
