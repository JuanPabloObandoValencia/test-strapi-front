<script setup>
// App now uses Vue Router for navigation
</script>

<template>
  <div id="app">
    <transition name="view-fade" mode="out-in">
      <router-view />
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
