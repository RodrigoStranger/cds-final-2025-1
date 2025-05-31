<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingLine ? 'Editar Línea' : 'Nueva Línea' }}</h3>
        <button @click="$emit('close')" class="close-button">
          <X class="icon" />
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSave">
          <div class="form-group">
            <label class="required">Nombre</label>
            <input 
              v-model="lineForm.nombre" 
              type="text" 
              required
              :class="{ error: lineErrors.nombre }"
              placeholder="Ingrese el nombre de la línea"
            >
            <span v-if="lineErrors.nombre" class="error-message">{{ lineErrors.nombre }}</span>
          </div>
          <div class="form-group">
            <label>RUC</label>
            <input 
              v-model="lineForm.ruc" 
              type="text"
              :class="{ error: lineErrors.ruc }"
              placeholder="RUC de la línea (opcional)"
              @input="formatRuc"
            >
            <span v-if="lineErrors.ruc" class="error-message">{{ lineErrors.ruc }}</span>
            <span class="help-text">El RUC debe tener 11 dígitos</span>
          </div>
          <div class="form-group">
            <label>Proveedor</label>
            <input 
              v-model="lineForm.proveedor" 
              type="text"
              placeholder="Nombre del proveedor (opcional)"
            >
          </div>
          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="button secondary">Cancelar</button>
            <button type="submit" class="button primary">{{ editingLine ? 'Actualizar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';

const props = defineProps({
  show: Boolean,
  editingLine: Object,
  lineForm: Object,
  lineErrors: Object
});

const emit = defineEmits(['close', 'save']);

const validateLine = () => {
  let isValid = true;
  
  // Reset errores
  Object.keys(props.lineErrors).forEach(key => props.lineErrors[key] = '');
  
  // Validar nombre (OBLIGATORIO)
  if (!props.lineForm.nombre.trim()) {
    props.lineErrors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (props.lineForm.nombre.length < 2) {
    props.lineErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (props.lineForm.nombre.length > 30) {
    props.lineErrors.nombre = 'El nombre no puede exceder 30 caracteres';
    isValid = false;
  }
  
  // Validar RUC (OPCIONAL, pero si se ingresa debe ser válido)
  if (props.lineForm.ruc && props.lineForm.ruc.trim()) {
    if (!/^\d{11}$/.test(props.lineForm.ruc)) {
      props.lineErrors.ruc = 'El RUC debe tener exactamente 11 dígitos';
      isValid = false;
    }
  }
  
  return isValid;
};

const formatRuc = (event) => {
  props.lineForm.ruc = event.target.value.replace(/\D/g, '');
};

const handleSave = () => {
  if (validateLine()) {
    emit('save');
  }
};
</script>

<style scoped>
@import '../styles/components/LineModal.css';
</style>
