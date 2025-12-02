<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>
    <div class="base-input__wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="['base-input__field', { 'base-input__field--error': error }]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <span v-if="type === 'password'" class="base-input__icon" @click="togglePassword">
        {{ showPassword ? '👁️' : '👁️‍🗨️' }}
      </span>
    </div>
    <transition name="error-fade">
      <p v-if="error" class="base-input__error">{{ error }}</p>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const showPassword = ref(false);
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const handleBlur = (event) => {
  emit('blur', event);
};

const handleFocus = (event) => {
  emit('focus', event);
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  const input = document.getElementById(inputId.value);
  input.type = showPassword.value ? 'text' : 'password';
};
</script>

<style scoped>
.base-input {
  width: 100%;
  margin-bottom: 1.5rem;
}

.base-input__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.base-input__required {
  color: #f56565;
  margin-left: 2px;
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__field {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;
}

.base-input__field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.base-input__field:disabled {
  background: #f7fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

.base-input__field--error {
  border-color: #f56565;
}

.base-input__field--error:focus {
  box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
}

.base-input__icon {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  user-select: none;
  font-size: 1.25rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.base-input__icon:hover {
  opacity: 1;
}

.base-input__error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #f56565;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
