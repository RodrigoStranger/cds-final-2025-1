<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
        <button @click="$emit('close')" class="close-button">
          <X class="icon" />
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSave" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="required">Nombre</label>
              <input 
                :value="productForm.nombre"
                @input="(e) => $emit('update:productForm', { ...productForm, nombre: e.target.value })"
                type="text" 
                :class="{ 
                  'input-error': productErrors.nombre || nombreExistente,
                  'validating': validandoNombre
                }"
                placeholder="Ingrese el nombre del producto"
                @input.native="$emit('clear-error', 'nombre')"
                :disabled="validandoNombre"
              >
              <div class="validation-messages">
                <transition name="fade">
                  <div v-if="validandoNombre" class="validating-message">
                    Validando nombre...
                  </div>
                  <div v-else-if="nombreExistente" class="error-message">
                    {{ nombreExistente }}
                  </div>
                  <div v-else-if="productErrors.nombre" class="error-message">
                    {{ productErrors.nombre }}
                  </div>
                </transition>
              </div>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea 
                v-model="productForm.descripcion"
                :class="{ 'input-error': productErrors.descripcion }"
                placeholder="Descripción del producto (opcional)"
                @input="$emit('clear-error', 'descripcion')"
              ></textarea>
              <transition name="fade">
                <div v-if="productErrors.descripcion" class="error-message">
                  {{ productErrors.descripcion }}
                </div>
              </transition>
            </div>
            <div class="form-group">
              <label class="required">Precio Compra</label>
              <input 
                v-model="productForm.precio_compra" 
                type="number" 
                step="0.01"
                :class="{ 'input-error': productErrors.precio_compra }"
                placeholder="0.00"
                @input="$emit('clear-error', 'precio_compra')"
              >
              <transition name="fade">
                <div v-if="productErrors.precio_compra" class="error-message">
                  {{ productErrors.precio_compra }}
                </div>
              </transition>
            </div>
            <div class="form-group">
              <label class="required">Precio Venta</label>
              <input 
                v-model="productForm.precio_venta" 
                type="number" 
                step="0.01"
                :class="{ 'input-error': productErrors.precio_venta }"
                placeholder="0.00"
                @input="$emit('clear-error', 'precio_venta')"
              >
              <transition name="fade">
                <div v-if="productErrors.precio_venta" class="error-message">
                  {{ productErrors.precio_venta }}
                </div>
              </transition>
            </div>
            <div class="form-group">
              <label class="required">Stock</label>
              <input 
                v-model.number="productForm.stock" 
                type="number" 
                min="0"
                :class="{ 'input-error': productErrors.stock }"
                placeholder="0"
                @input="$emit('clear-error', 'stock')"
              >
              <transition name="fade">
                <div v-if="productErrors.stock" class="error-message">
                  {{ productErrors.stock }}
                </div>
              </transition>
            </div>

            <div class="form-group">
              <label>Categoría</label>
              <div class="relative">
                <select 
                  v-model="productForm.cod_categoria"
                  class="w-full"
                  :class="{ 'input-error': productErrors.cod_categoria }"
                  @change="$emit('clear-error', 'cod_categoria')"
                >
                  <option :value="null">Sin categoría</option>
                  <option 
                    v-for="cat in (props.categorias || []).filter(c => c && c.cod_categoria)" 
                    :key="cat.cod_categoria" 
                    :value="cat.cod_categoria"
                  >
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <transition name="fade">
                <div v-if="productErrors.cod_categoria" class="error-message">
                  {{ productErrors.cod_categoria }}
                </div>
              </transition>
            </div>
            <div class="form-group">
              <label>Línea</label>
              <div class="relative">
                <select 
                  v-model="productForm.cod_linea"
                  class="w-full"
                  :class="{ 'input-error': productErrors.cod_linea }"
                  @change="$emit('clear-error', 'cod_linea')"
                >
                  <option :value="null">Sin línea</option>
                  <option 
                    v-for="line in (props.lineas || []).filter(l => l && (l.cod_linea || l.id))" 
                    :key="line.cod_linea || line.id" 
                    :value="line.cod_linea || line.id"
                  >
                    {{ line.nombre || line.nombre_linea }}
                  </option>
                </select>
              </div>
              <transition name="fade">
                <div v-if="productErrors.cod_linea" class="error-message">
                  {{ productErrors.cod_linea }}
                </div>
              </transition>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="handleClose" class="button secondary">Cancelar</button>
            <button type="submit" class="button primary">{{ editingProduct ? 'Actualizar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import ProductoService from '../services/productoService';

const props = defineProps({
  show: Boolean,
  editingProduct: Object,
  productForm: Object,
  productErrors: Object,
  categorias: Array,
  lineas: Array
});

const emit = defineEmits(['update:show', 'save', 'close', 'clear-error']);

// Estado para el mensaje de validación de nombre existente
const nombreExistente = ref('');
const validandoNombre = ref(false);

// Función de debounce para la validación del nombre
let timeoutId = null;

const validarNombreUnico = async () => {
  const nombre = props.productForm.nombre?.trim();
  
  if (!nombre || (props.editingProduct && nombre === props.editingProduct.nombre)) {
    nombreExistente.value = '';
    return;
  }
  
  // Validar solo si el nombre tiene al menos 2 caracteres
  if (nombre.length < 2) {
    nombreExistente.value = '';
    return;
  }
  
  try {
    validandoNombre.value = true;
    const respuesta = await ProductoService.verificarNombre(nombre);
    // Usar el mensaje del servidor si existe, o uno por defecto
    nombreExistente.value = respuesta.resultado ? respuesta.mensaje || 'Ya existe un producto con este nombre' : '';
  } catch (error) {
    console.error('Error al verificar el nombre:', error);
    // Mostrar mensaje genérico si hay un error de conexión
    if (error.response) {
      // El servidor respondió con un código de error
      nombreExistente.value = 'Error al verificar el nombre. Intente nuevamente.';
    }
  } finally {
    validandoNombre.value = false;
  }
};

// Watcher para validar el nombre cuando cambia
watch(() => props.productForm.nombre, () => {
  // Limpiar timeout anterior
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  // Establecer nuevo timeout
  timeoutId = setTimeout(() => {
    validarNombreUnico();
  }, 500); // 500ms de delay
});

const validateProduct = () => {
  let isValid = true;
  
  // Reset errores
  Object.keys(props.productErrors).forEach(key => props.productErrors[key] = '');
  
  // Validar nombre
  if (!props.productForm.nombre || props.productForm.nombre.trim() === '') {
    props.productErrors.nombre = 'El nombre es obligatorio';
    isValid = false;
  } else if (props.productForm.nombre.length < 2) {
    props.productErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (nombreExistente.value) {
    // No permitir guardar si el nombre ya existe
    isValid = false;
  } else {
    props.productErrors.nombre = '';
  }
  
  // Validar descripción (OPCIONAL)
  if (props.productForm.descripcion && props.productForm.descripcion.length > 500) {
    props.productErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    isValid = false;
  }
  
  // Validar precio de compra (OBLIGATORIO)
  if (props.productForm.precio_compra === null || props.productForm.precio_compra === undefined || props.productForm.precio_compra === '') {
    props.productErrors.precio_compra = 'El precio de compra es requerido';
    isValid = false;
  } else if (isNaN(parseFloat(props.productForm.precio_compra))) {
    props.productErrors.precio_compra = 'El precio de compra debe ser un número válido';
    isValid = false;
  } else if (parseFloat(props.productForm.precio_compra) <= 0) {
    props.productErrors.precio_compra = 'El precio de compra debe ser mayor a 0';
    isValid = false;
  } else if (parseFloat(props.productForm.precio_compra) > 999999) {
    props.productErrors.precio_compra = 'El precio de compra es demasiado alto';
    isValid = false;
  }
  
  // Validar precio de venta (OBLIGATORIO)
  if (props.productForm.precio_venta === null || props.productForm.precio_venta === undefined || props.productForm.precio_venta === '') {
    props.productErrors.precio_venta = 'El precio de venta es requerido';
    isValid = false;
  } else if (isNaN(parseFloat(props.productForm.precio_venta))) {
    props.productErrors.precio_venta = 'El precio de venta debe ser un número válido';
    isValid = false;
  } else if (parseFloat(props.productForm.precio_venta) <= 0) {
    props.productErrors.precio_venta = 'El precio de venta debe ser mayor a 0';
    isValid = false;
  } else if (parseFloat(props.productForm.precio_venta) > 999999) {
    props.productErrors.precio_venta = 'El precio de venta es demasiado alto';
    isValid = false;
  }
  
  // Validar que el precio de venta sea mayor al de compra
  if (isValid && parseFloat(props.productForm.precio_venta) <= parseFloat(props.productForm.precio_compra)) {
    props.productErrors.precio_venta = 'El precio de venta debe ser mayor al precio de compra';
    isValid = false;
  }
  
  // Validar stock (OBLIGATORIO)
  if (props.productForm.stock === null || props.productForm.stock === undefined || props.productForm.stock === '') {
    props.productErrors.stock = 'El stock es requerido';
    isValid = false;
  } else if (isNaN(parseInt(props.productForm.stock))) {
    props.productErrors.stock = 'El stock debe ser un número entero válido';
    isValid = false;
  } else if (parseInt(props.productForm.stock) <= 0) {
    props.productErrors.stock = 'El stock debe ser mayor a 0';
    isValid = false;
  } else if (parseInt(props.productForm.stock) > 999999) {
    props.productErrors.stock = 'El stock es demasiado alto';
    isValid = false;
  }
  
  // Validar categoría (OPCIONAL)
  if (props.productForm.cod_categoria && isNaN(parseInt(props.productForm.cod_categoria))) {
    props.productErrors.cod_categoria = 'Categoría inválida';
    isValid = false;
  }
  
  // Validar línea (OPCIONAL)
  if (props.productForm.cod_linea && isNaN(parseInt(props.productForm.cod_linea))) {
    props.productErrors.cod_linea = 'Línea inválida';
    isValid = false;
  }
  
  return isValid;
};

const handleClose = () => {
  // Limpiar timeout si existe
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  // Limpiar errores antes de cerrar
  Object.keys(props.productErrors).forEach(key => {
    props.productErrors[key] = '';
  });
  
  // Limpiar estado de validación
  nombreExistente.value = '';
  validandoNombre.value = false;
  
  emit('close');
};



const handleSave = async (e) => {
  e.preventDefault();
  
  
  if (validateProduct()) {
    // Preparar los datos para enviar
    const dataToSend = { ...props.productForm };
    
    // Si es una actualización, asegurarse de incluir el ID
    if (props.editingProduct) {
      dataToSend.cod_producto = props.editingProduct.cod_producto;
    }
    
    // Emitir el evento save con los datos formateados
    emit('save', dataToSend);
  }
};
</script>

<style scoped>
@import '../styles/components/ProductModal.css';

/* Estilos para el checkbox personalizado */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 0.5rem;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 8px;
  transition: all 0.2s;
}

.checkbox-input:checked ~ .checkbox-custom {
  background-color: #10b981;
  border-color: #10b981;
}

.checkbox-input:checked ~ .checkbox-custom:after {
  content: '';
  position: absolute;
  left: 7px;
  top: 3px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:focus ~ .checkbox-custom {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Estilos para el campo de stock deshabilitado */
.input-disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Estilos para el mensaje de información */
.info-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border-right: 3px solid #9ca3af;
}

.validation-messages {
  min-height: 1.5rem;
  margin-top: 0.25rem;
  position: relative;
  width: 100%;
}

.validating-message {
  color: #666;
  font-size: 0.8rem;
  font-style: italic;
  display: block;
  margin-top: 0.25rem;
}

.error-message {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.input-error {
  border-color: #f56565 !important;
}

.validating {
  background-color: #f7fafc;
  border-color: #cbd5e0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Asegurar que el input ocupe todo el ancho disponible */
.form-group input[type="text"] {
  width: 100%;
}
</style>
