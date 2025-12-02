<template>
  <div class="dashboard-view">
    <div class="dashboard-view__header">
      <h1 class="dashboard-view__title">Dashboard</h1>
      <BaseButton variant="danger" @click="handleLogout">
        Cerrar Sesión
      </BaseButton>
    </div>

    <div class="dashboard-view__content">
      <BaseCard>
        <template #header>
          <h2 class="dashboard-view__card-title">Información del Usuario</h2>
        </template>

        <div v-if="user" class="dashboard-view__user-info">
          <div class="dashboard-view__avatar">
            {{ user.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="dashboard-view__details">
            <div class="dashboard-view__detail">
              <span class="dashboard-view__label">Usuario:</span>
              <span class="dashboard-view__value">{{ user.username }}</span>
            </div>
            <div class="dashboard-view__detail">
              <span class="dashboard-view__label">Email:</span>
              <span class="dashboard-view__value">{{ user.email }}</span>
            </div>
            <div class="dashboard-view__detail">
              <span class="dashboard-view__label">ID:</span>
              <span class="dashboard-view__value">{{ user.id }}</span>
            </div>
          </div>
        </div>

        <LoadingSpinner v-else size="medium" text="Cargando información..." />
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2 class="dashboard-view__card-title">Bienvenido</h2>
        </template>

        <div class="dashboard-view__welcome">
          <p class="dashboard-view__welcome-text">
            ¡Hola <strong>{{ user?.username }}</strong>! 👋
          </p>
          <p class="dashboard-view__welcome-description">
            Has iniciado sesión exitosamente. Esta es tu área personal donde puedes gestionar tu cuenta y acceder a todas las funcionalidades.
          </p>
          <div class="dashboard-view__stats">
            <div class="dashboard-view__stat">
              <div class="dashboard-view__stat-value">✅</div>
              <div class="dashboard-view__stat-label">Conectado</div>
            </div>
            <div class="dashboard-view__stat">
              <div class="dashboard-view__stat-value">🔒</div>
              <div class="dashboard-view__stat-label">Seguro</div>
            </div>
            <div class="dashboard-view__stat">
              <div class="dashboard-view__stat-value">⚡</div>
              <div class="dashboard-view__stat-label">Rápido</div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { useStrapiAuth } from '@/composables/useStrapiAuth';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';

const { user, logout } = useStrapiAuth();

const handleLogout = () => {
  logout();
};
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.dashboard-view__header {
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

.dashboard-view__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-view__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-view__card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.dashboard-view__user-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.dashboard-view__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.dashboard-view__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dashboard-view__detail {
  display: flex;
  gap: 0.5rem;
}

.dashboard-view__label {
  font-weight: 600;
  color: #4a5568;
  min-width: 80px;
}

.dashboard-view__value {
  color: #2d3748;
}

.dashboard-view__welcome {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-view__welcome-text {
  font-size: 1.25rem;
  color: #2d3748;
  margin: 0;
}

.dashboard-view__welcome-description {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

.dashboard-view__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.dashboard-view__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.dashboard-view__stat:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard-view__stat-value {
  font-size: 2rem;
}

.dashboard-view__stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #718096;
}

@media (max-width: 768px) {
  .dashboard-view__user-info {
    flex-direction: column;
    text-align: center;
  }

  .dashboard-view__header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
