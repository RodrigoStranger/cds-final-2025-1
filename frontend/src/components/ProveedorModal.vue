<template>
  <div v-if="show" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ proveedor.ruc ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h3>
        <button class="close-button" @click="$emit('close')">
          <X class="icon" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="ruc">RUC</label>
            <input
              id="ruc"
              v-model="formData.ruc"
              type="text"
              class="form-control"
              :disabled="!!proveedor.ruc"
              required
              maxlength="11"
              pattern="\d{11}"
              title="El RUC debe tener 11 dígitos"
            />
            <div v-if="errors.ruc" class="error-message">{{ errors.ruc }}</div>
          </div>

          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="form-control"
              required
              minlength="3"
            />
            <div v-if="errors.nombre" class="error-message">{{ errors.nombre }}</div>
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono (Opcional)</label>
            <input
              id="telefono"
              v-model="formData.telefono"
              type="tel"
              class="form-control"
              pattern="[0-9]{7,15}"
              title="Ingrese un número de teléfono válido"
            />
            <div v-if="errors.telefono" class="error-message">{{ errors.telefono }}</div>
          </div>

          <div class="modal-footer">
            <button type="button" class="button secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="button primary" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ proveedor.ruc ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  proveedor: {
    type: Object,
    default: () => ({
      ruc: '',
      nombre: '',
      telefono: ''
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const formData = reactive({
  ruc: '',
  nombre: '',
  telefono: ''
});

const errors = reactive({
  ruc: '',
  nombre: '',
  telefono: ''
});

// Actualizar formData cuando cambie el prop proveedor
watch(() => props.proveedor, (newVal) => {
  Object.assign(formData, {
    ruc: newVal.ruc || '',
    nombre: newVal.nombre || '',
    telefono: newVal.telefono || ''
  });
}, { immediate: true, deep: true });

const validateForm = () => {
  let isValid = true;
  
  // Resetear errores
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // Validar RUC
  if (!formData.ruc) {
    errors.ruc = 'El RUC es obligatorio';
    isValid = false;
  } else if (!/^\d{11}$/.test(formData.ruc)) {
    errors.ruc = 'El RUC debe tener 11 dígitos';
    isValid = false;
  }
  
  // Validar nombre
  if (!formData.nombre) {
    errors.nombre = 'El nombre es obligatorio';
    isValid = false;
  } else if (formData.nombre.length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    isValid = false;
  }
  
  // Validar teléfono (opcional)
  if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) {
    errors.telefono = 'Ingrese un número de teléfono válido';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', { ...formData });
  }
};
</script>

<style scoped>
@import '../styles/components/ProveedorModal.css';
</style>
