<template>
  <div class="auth-layout">
    <div class="auth-layout__background">
      <div class="auth-layout__gradient auth-layout__gradient--1"></div>
      <div class="auth-layout__gradient auth-layout__gradient--2"></div>
      <div class="auth-layout__gradient auth-layout__gradient--3"></div>
    </div>
    <div class="auth-layout__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// No props needed for this layout
</script>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.auth-layout__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-layout__gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.auth-layout__gradient--1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.auth-layout__gradient--2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -10%;
  right: -10%;
  animation-delay: 7s;
}

.auth-layout__gradient--3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.auth-layout__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
}
</style>
