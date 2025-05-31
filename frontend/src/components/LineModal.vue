<script setup>
import { ref, reactive, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  show: Boolean,
  editingLine: Object,
  lineForm: {
    type: Object,
    required: true,
    default: () => ({
      nombre: '',
      proveedorRuc: null,
      proveedorNombre: null
    })
  },
  lineErrors: {
    type: Object,
    default: () => ({})
  },
  proveedores: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits([
  'close',
  'save',
  'update:lineForm',
  'clear-error'
]);

// Use a reactive object to track the selected supplier
const selectedSupplier = reactive({
  ruc: props.lineForm?.proveedorRuc || null,
  nombre: props.lineForm?.proveedorNombre || null
});

// Watch for changes in the lineForm prop
watch(() => props.lineForm, (newVal) => {
  console.log('lineForm changed:', JSON.stringify(newVal, null, 2));
  selectedSupplier.ruc = newVal?.proveedorRuc || null;
  selectedSupplier.nombre = newVal?.proveedorNombre || null;
}, { immediate: true });

// Watch for changes in the selected supplier RUC
watch(() => selectedSupplier.ruc, (newRuc) => {
  console.log('Selected RUC changed:', newRuc);
  
  // Find the selected supplier to update the name
  const selectedProveedor = newRuc 
    ? props.proveedores.find(p => p.ruc == newRuc)
    : null;
  
  if (selectedProveedor) {
    selectedSupplier.nombre = selectedProveedor.nombre;
  } else if (newRuc === null) {
    selectedSupplier.nombre = null;
  }
  
  // Update the parent component's form data
  const updatedForm = {
    ...props.lineForm,
    proveedorRuc: newRuc,
    proveedorNombre: selectedSupplier.nombre,
    ruc: newRuc  // Ensure RUC is also set at the root level for compatibility
  };
  
  console.log('Emitting update:lineForm with:', updatedForm);
  emit('update:lineForm', updatedForm);
});

// Watch for changes in proveedores prop
watch(() => props.proveedores, (newProveedores) => {
  console.log('Proveedores actualizados en el modal:', JSON.stringify(newProveedores, null, 2));
  
  // If we have a selected RUC, make sure the supplier still exists
  if (selectedSupplier.ruc && newProveedores.length > 0) {
    const found = newProveedores.find(p => p.ruc == selectedSupplier.ruc);
    if (!found) {
      console.warn(`Proveedor con RUC ${selectedSupplier.ruc} no encontrado en la lista`);
      // Reset selection if supplier no longer exists
      selectedSupplier.ruc = null;
      selectedSupplier.nombre = null;
    } else if (found.nombre !== selectedSupplier.nombre) {
      // Update name if it changed
      selectedSupplier.nombre = found.nombre;
    }
  }
}, { immediate: true });

const handleProveedorChange = (event) => {
  const selectedRuc = event?.target?.value ? event.target.value : null;
  console.log('Selected RUC from event:', selectedRuc);
  
  // Encontrar el proveedor seleccionado
  const selectedProveedor = selectedRuc 
    ? props.proveedores.find(p => p.ruc == selectedRuc)
    : null;
    
  console.log('Found proveedor:', selectedProveedor);
  
  // Actualizar el formulario local
  props.lineForm.proveedorRuc = selectedRuc;
  props.lineForm.proveedorNombre = selectedProveedor?.nombre || null;
  props.lineForm.ruc = selectedRuc;
  
  // Actualizar el objeto reactivo para la UI
  selectedSupplier.ruc = selectedRuc;
  selectedSupplier.nombre = selectedProveedor?.nombre || null;
  
  // Emitir el evento de actualización
  emit('update:lineForm', { ...props.lineForm });
};

const handleSave = () => {
  if (validateLine()) {
    emit('save');
  }
};

const validateLine = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(props.lineErrors).forEach(key => props.lineErrors[key] = '');
  
  // Validate name (REQUIRED)
  if (!props.lineForm.nombre.trim()) {
    props.lineErrors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (props.lineForm.nombre.length < 2) {
    props.lineErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  }
  
  return isValid;
};
</script>

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
              :class="{ 'input-error': lineErrors && lineErrors.nombre }"
              placeholder="Ingrese el nombre de la línea"
              @input="emit('clear-error', 'nombre')"
            >
            <transition name="fade">
              <div v-if="lineErrors && lineErrors.nombre" class="error-message">
                {{ lineErrors.nombre }}
              </div>
            </transition>
          </div>

          <!-- Supplier Selection -->
          <div class="mb-4">
            <label for="proveedor" class="block text-sm font-medium text-gray-700 mb-1">
              Proveedor (opcional)
            </label>
            <select
              id="proveedor"
              v-model="lineForm.proveedorRuc"
              @change="handleProveedorChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option :value="null">Seleccione un proveedor (opcional)</option>
              <option 
                v-for="proveedor in proveedores" 
                :key="proveedor.ruc" 
                :value="proveedor.ruc"
              >
                {{ proveedor.nombre }} ({{ proveedor.ruc }})
              </option>
            </select>
            <div v-if="lineErrors.proveedorId" class="mt-1 text-sm text-red-600">
              {{ lineErrors.proveedorId }}
            </div>
            <div class="mt-1 text-xs text-gray-500">
              <div>Proveedor seleccionado: {{ selectedSupplier.nombre || 'Ninguno' }}</div>
              <div>RUC: {{ selectedSupplier.ruc || 'No seleccionado' }}</div>
            </div>
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

<style scoped>
@import '../styles/components/LineModal.css';

/* Estilos para el select personalizado */
.form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1a1a1a;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-select:focus {
  border-color: #3b82f6;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

/* Estilo para opciones del select */
option {
  padding: 0.5rem;
}

/* Mejorar el espaciado entre elementos del formulario */
.form-group {
  margin-bottom: 1.25rem;
}

/* Estilo para mensajes de error */
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

/* Asegurar que el contenedor del select ocupe todo el ancho */
select {
  width: 100%;
}

/* Transición para mensajes de error */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
