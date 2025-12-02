<template>
  <AuthLayout>
    <BaseCard glass>
      <div class="login-view">
        <div class="login-view__tabs">
          <button
            :class="['login-view__tab', { 'login-view__tab--active': activeTab === 'login' }]"
            @click="activeTab = 'login'"
          >
            Iniciar Sesión
          </button>
          <button
            :class="['login-view__tab', { 'login-view__tab--active': activeTab === 'register' }]"
            @click="activeTab = 'register'"
          >
            Registrarse
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <LoginForm v-if="activeTab === 'login'" key="login" @success="handleSuccess" />
          <RegisterForm v-else key="register" @success="handleSuccess" />
        </transition>
      </div>
    </BaseCard>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

const activeTab = ref('login');

const handleSuccess = () => {
  console.log('Autenticación exitosa');
};
</script>

<style scoped>
.login-view {
  width: 100%;
}

.login-view__tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.login-view__tab {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-family: inherit;
}

.login-view__tab::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.login-view__tab--active {
  color: #667eea;
}

.login-view__tab--active::after {
  transform: scaleX(1);
}

.login-view__tab:hover:not(.login-view__tab--active) {
  color: #4a5568;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
