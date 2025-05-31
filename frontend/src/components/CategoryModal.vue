<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
        <button @click="$emit('close')" class="close-button">
          <X class="icon" />
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSave">
          <div class="form-group">
            <label class="required">Nombre</label>
            <input 
              v-model="categoryForm.nombre" 
              type="text" 
              required
              :class="{ error: categoryErrors.nombre }"
              placeholder="Ingrese el nombre de la categoría"
            >
            <span v-if="categoryErrors.nombre" class="error-message">{{ categoryErrors.nombre }}</span>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="categoryForm.descripcion"
              placeholder="Descripción de la categoría (opcional)"
            ></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="button secondary">Cancelar</button>
            <button type="submit" class="button primary" :disabled="isSubmitting">
              <span v-if="isSubmitting">Guardando...</span>
              <span v-else>{{ editingCategory ? 'Actualizar' : 'Crear' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import CategoriaService from '../services/categoriaService';

const props = defineProps({
  show: Boolean,
  editingCategory: Object,
  categoryForm: Object,
  categoryErrors: Object
});

const emit = defineEmits(['close', 'save']);
const isSubmitting = ref(false);

// Función para verificar si el nombre de la categoría ya existe
const verificarNombreExistente = async (nombre) => {
  try {
    // Si estamos editando y el nombre no ha cambiado, no es necesario verificar
    if (props.editingCategory && props.editingCategory.nombre === nombre) {
      return false;
    }
    
    const response = await CategoriaService.verificarNombre(nombre);
    return response.existe;
  } catch (error) {
    console.error('Error al verificar el nombre de la categoría:', error);
    return false;
  }
};

const validateCategory = async () => {
  let isValid = true;
  
  // Reset errores
  Object.keys(props.categoryErrors).forEach(key => props.categoryErrors[key] = '');
  
  // Validar nombre (OBLIGATORIO)
  if (!props.categoryForm.nombre.trim()) {
    props.categoryErrors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (props.categoryForm.nombre.length < 2) {
    props.categoryErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (props.categoryForm.nombre.length > 30) {
    props.categoryErrors.nombre = 'El nombre no puede exceder 30 caracteres';
    isValid = false;
  } else {
    // Verificar si el nombre ya existe en la base de datos
    const nombreExiste = await verificarNombreExistente(props.categoryForm.nombre);
    if (nombreExiste) {
      props.categoryErrors.nombre = 'Este nombre de categoría ya existe';
      isValid = false;
    }
  }
  
  return isValid;
};

const handleSave = async () => {
  isSubmitting.value = true;
  
  try {
    if (await validateCategory()) {
      emit('save');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import '../styles/components/CategoryModal.css';
</style>
