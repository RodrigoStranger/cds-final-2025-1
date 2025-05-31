<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button @click="$emit('close')" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <div class="form-grid">
              <div class="form-group">
                <label class="required">Nombre</label>
                <input 
                  v-model="productForm.nombre" 
                  type="text" 
                  required
                  :class="{ error: productErrors.nombre }"
                  placeholder="Ingrese el nombre del producto"
                >
                <span v-if="productErrors.nombre" class="error-message">{{ productErrors.nombre }}</span>
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea 
                  v-model="productForm.descripcion"
                  placeholder="Descripción del producto (opcional)"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="required">Precio Compra</label>
                <input 
                  v-model="productForm.precio_compra" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required
                  :class="{ error: productErrors.precio_compra }"
                  placeholder="0.00"
                >
                <span v-if="productErrors.precio_compra" class="error-message">{{ productErrors.precio_compra }}</span>
              </div>
              <div class="form-group">
                <label class="required">Precio Venta</label>
                <input 
                  v-model="productForm.precio_venta" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required
                  :class="{ error: productErrors.precio_venta }"
                  placeholder="0.00"
                >
                <span v-if="productErrors.precio_venta" class="error-message">{{ productErrors.precio_venta }}</span>
              </div>
              <div class="form-group">
                <label class="required">Stock</label>
                <input 
                  v-model="productForm.stock" 
                  type="number" 
                  min="0"
                  required
                  :class="{ error: productErrors.stock }"
                  placeholder="0"
                >
                <span v-if="productErrors.stock" class="error-message">{{ productErrors.stock }}</span>
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="productForm.categoria">
                  <option value="">Sin categoría</option>
                  <option v-for="cat in categorias" :key="cat.nombre" :value="cat.nombre">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Línea</label>
                <select v-model="productForm.linea">
                  <option value="">Sin línea</option>
                  <option v-for="line in lineas" :key="line.nombre" :value="line.nombre">
                    {{ line.nombre }}
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="button secondary">Cancelar</button>
              <button type="submit" class="button primary">{{ editingProduct ? 'Actualizar' : 'Crear' }}</button>
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
    editingProduct: Object,
    productForm: Object,
    productErrors: Object,
    categorias: Array,
    lineas: Array
  });
  
  const emit = defineEmits(['close', 'save']);
  
  const validateProduct = () => {
    let isValid = true;
    
    // Reset errores
    Object.keys(props.productErrors).forEach(key => props.productErrors[key] = '');
    
    // Validar nombre (OBLIGATORIO)
    if (!props.productForm.nombre.trim()) {
      props.productErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (props.productForm.nombre.length < 2) {
      props.productErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    } else if (props.productForm.nombre.length > 50) {
      props.productErrors.nombre = 'El nombre no puede exceder 50 caracteres';
      isValid = false;
    }
    
    // Validar precio de compra (OBLIGATORIO)
    if (!props.productForm.precio_compra && props.productForm.precio_compra !== 0) {
      props.productErrors.precio_compra = 'El precio de compra es requerido';
      isValid = false;
    } else if (props.productForm.precio_compra < 0) {
      props.productErrors.precio_compra = 'El precio de compra no puede ser negativo';
      isValid = false;
    } else if (props.productForm.precio_compra > 999999) {
      props.productErrors.precio_compra = 'El precio de compra es demasiado alto';
      isValid = false;
    }
    
    // Validar precio de venta (OBLIGATORIO)
    if (!props.productForm.precio_venta && props.productForm.precio_venta !== 0) {
      props.productErrors.precio_venta = 'El precio de venta es requerido';
      isValid = false;
    } else if (props.productForm.precio_venta < 0) {
      props.productErrors.precio_venta = 'El precio de venta no puede ser negativo';
      isValid = false;
    } else if (props.productForm.precio_venta > 999999) {
      props.productErrors.precio_venta = 'El precio de venta es demasiado alto';
      isValid = false;
    }
    
    // Validar stock (OBLIGATORIO)
    if (!props.productForm.stock && props.productForm.stock !== 0) {
      props.productErrors.stock = 'El stock es requerido';
      isValid = false;
    } else if (props.productForm.stock < 0) {
      props.productErrors.stock = 'El stock no puede ser negativo';
      isValid = false;
    } else if (props.productForm.stock > 999999) {
      props.productErrors.stock = 'El stock es demasiado alto';
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSave = () => {
    if (validateProduct()) {
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
    max-width: 600px;
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
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }
  
  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
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
  .form-group select,
  .form-group textarea {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group select:focus,
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
  .form-group select.error,
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
  