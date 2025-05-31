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
@import '../styles/components/ProductModal.css';
</style>
