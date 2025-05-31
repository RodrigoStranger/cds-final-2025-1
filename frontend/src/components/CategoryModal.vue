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
              <button type="submit" class="button primary">{{ editingCategory ? 'Actualizar' : 'Crear' }}</button>
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
    editingCategory: Object,
    categoryForm: Object,
    categoryErrors: Object
  });
  
  const emit = defineEmits(['close', 'save']);
  
  const validateCategory = () => {
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
    }
    
    return isValid;
  };
  
  const handleSave = () => {
    if (validateCategory()) {
      emit('save');
    }
  };
  </script>
  
  <style scoped>
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }
  
  .modal {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #4b5563;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  
  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .form-group label.required::after {
    content: " *";
    color: #ef4444;
  }
  
  .form-group input,
  .form-group textarea {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #15803d;
    box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1);
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .form-group input.error,
  .form-group textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .button {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
  }
  
  .button.primary {
    background-color: #15803d;
    color: white;
  }
  
  .button.primary:hover {
    background-color: #166534;
  }
  
  .button.secondary {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .button.secondary:hover {
    background-color: #e5e7eb;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  </style>
  