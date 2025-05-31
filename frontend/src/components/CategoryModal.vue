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
        <form @submit.prevent="$emit('save')" novalidate>
          <div class="form-group">
            <label class="required">Nombre</label>
            <input 
              v-model="categoryForm.nombre" 
              type="text" 
              :class="{ 'input-error': categoryErrors.nombre }"
              placeholder="Ingrese el nombre de la categoría"
              @input="$emit('clear-error', 'nombre')"
            >
            <transition name="fade">
              <div v-if="categoryErrors.nombre" class="error-message">
                {{ categoryErrors.nombre }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="categoryForm.descripcion"
              :class="{ 'input-error': categoryErrors.descripcion }"
              placeholder="Descripción de la categoría (opcional)"
              @input="$emit('clear-error', 'descripcion')"
            ></textarea>
            <transition name="fade">
              <div v-if="categoryErrors.descripcion" class="error-message">
                {{ categoryErrors.descripcion }}
              </div>
            </transition>
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

const emit = defineEmits(['close']);
const isSubmitting = ref(false);
</script>

<style scoped>
@import '../styles/components/CategoryModal.css';

/* Error message styling */
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  min-height: 1.25rem;
}

/* Input error state */
.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444;
}

/* Fade transition for error messages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
