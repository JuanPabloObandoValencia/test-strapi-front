<template>
  <div class="login-form">
    <h2 class="login-form__title">Iniciar Sesión</h2>
    <p class="login-form__subtitle">Bienvenido de nuevo</p>

    <form @submit.prevent="handleSubmit">
      <BaseInput
        v-model="formData.identifier"
        label="Email o Usuario"
        type="text"
        placeholder="tu@email.com"
        :error="errors.identifier"
        required
        @blur="validateIdentifier"
      />

      <BaseInput
        v-model="formData.password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
        required
        @blur="validatePassword"
      />

      <div v-if="authError" class="login-form__error">
        <span>⚠️</span>
        <span>{{ authError }}</span>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading"
        class="login-form__submit"
      >
        Iniciar Sesión
      </BaseButton>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStrapiAuth } from '@/composables/useStrapiAuth';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const emit = defineEmits(['success']);

const { login, loading, error } = useStrapiAuth();

const formData = ref({
  identifier: '',
  password: ''
});

const errors = ref({
  identifier: '',
  password: ''
});

const authError = computed(() => error.value);

const validateIdentifier = () => {
  if (!formData.value.identifier) {
    errors.value.identifier = 'El email o usuario es requerido';
    return false;
  }
  errors.value.identifier = '';
  return true;
};

const validatePassword = () => {
  if (!formData.value.password) {
    errors.value.password = 'La contraseña es requerida';
    return false;
  }
  if (formData.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres';
    return false;
  }
  errors.value.password = '';
  return true;
};

const handleSubmit = async () => {
  const isIdentifierValid = validateIdentifier();
  const isPasswordValid = validatePassword();

  if (!isIdentifierValid || !isPasswordValid) {
    return;
  }

  try {
    await login(formData.value.identifier, formData.value.password);
    emit('success');
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
}

.login-form__title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form__subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0 0 2rem 0;
}

.login-form__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.login-form__submit {
  width: 100%;
  margin-top: 0.5rem;
}
</style>
