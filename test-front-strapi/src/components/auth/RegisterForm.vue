<template>
  <div class="register-form">
    <h2 class="register-form__title">Crear Cuenta</h2>
    <p class="register-form__subtitle">Únete a nosotros hoy</p>

    <form @submit.prevent="handleSubmit">
      <BaseInput
        v-model="formData.username"
        label="Nombre de Usuario"
        type="text"
        placeholder="usuario123"
        :error="errors.username"
        required
        @blur="validateUsername"
      />

      <BaseInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="tu@email.com"
        :error="errors.email"
        required
        @blur="validateEmail"
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

      <BaseInput
        v-model="formData.confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        placeholder="••••••••"
        :error="errors.confirmPassword"
        required
        @blur="validateConfirmPassword"
      />

      <div v-if="authError" class="register-form__error">
        <span>⚠️</span>
        <span>{{ authError }}</span>
      </div>

      <BaseButton
        type="submit"
        variant="secondary"
        :loading="loading"
        class="register-form__submit"
      >
        Registrarse
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

const { register, loading, error } = useStrapiAuth();

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const authError = computed(() => error.value);

const validateUsername = () => {
  if (!formData.value.username) {
    errors.value.username = 'El nombre de usuario es requerido';
    return false;
  }
  if (formData.value.username.length < 3) {
    errors.value.username = 'El nombre debe tener al menos 3 caracteres';
    return false;
  }
  errors.value.username = '';
  return true;
};

const validateEmail = () => {
  if (!formData.value.email) {
    errors.value.email = 'El email es requerido';
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'El email no es válido';
    return false;
  }
  errors.value.email = '';
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

const validateConfirmPassword = () => {
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Debes confirmar la contraseña';
    return false;
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden';
    return false;
  }
  errors.value.confirmPassword = '';
  return true;
};

const handleSubmit = async () => {
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }

  try {
    await register(formData.value.username, formData.value.email, formData.value.password);
    emit('success');
  } catch (err) {
    console.error('Error al registrar:', err);
  }
};
</script>

<style scoped>
.register-form {
  width: 100%;
}

.register-form__title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-form__subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0 0 2rem 0;
}

.register-form__error {
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

.register-form__submit {
  width: 100%;
  margin-top: 0.5rem;
}
</style>
