<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="$emit('close')" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <Trash class="icon-large" />
            </div>
            <div class="delete-text">
              <h4>¿Estás seguro?</h4>
              <p>{{ message }}</p>
              <p class="warning-text">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="button secondary">Cancelar</button>
            <button @click="$emit('confirm')" class="button danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { X, Trash } from 'lucide-vue-next';
  
  defineProps({
    show: Boolean,
    message: String
  });
  
  defineEmits(['close', 'confirm']);
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
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal.delete-modal {
    max-width: 400px;
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
  
  /* Modal de confirmación de eliminación */
  .delete-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .delete-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: #fef2f2;
    color: #ef4444;
    flex-shrink: 0;
  }
  
  .icon-large {
    width: 3rem;
    height: 3rem;
  }
  
  .delete-text {
    flex: 1;
  }
  
  .delete-text h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .delete-text p {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .warning-text {
    color: #ef4444;
    font-weight: 500;
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
  
  .button.secondary {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .button.secondary:hover {
    background-color: #e5e7eb;
  }
  
  .button.danger {
    background-color: #ef4444;
    color: white;
  }
  
  .button.danger:hover {
    background-color: #dc2626;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  </style>
  