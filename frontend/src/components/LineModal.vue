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

// Manejar el cierre del modal
const handleClose = () => {
  // Limpiar errores antes de cerrar
  if (props.lineErrors) {
    Object.keys(props.lineErrors).forEach(key => {
      if (props.lineErrors[key]) {
        emit('clear-error', key);
      }
    });
  }
  
  emit('close');
};

// Use a reactive object to track the selected supplier
const selectedSupplier = reactive({
  ruc: props.lineForm?.proveedorRuc || null,
  nombre: props.lineForm?.proveedorNombre || null
});

// Watch for changes in the lineForm prop
watch(() => props.lineForm, (newVal) => {
  selectedSupplier.ruc = newVal?.proveedorRuc || null;
  selectedSupplier.nombre = newVal?.proveedorNombre || null;
}, { immediate: true });

// Watch for changes in the selected supplier RUC
watch(() => selectedSupplier.ruc, (newRuc) => {
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
  
  emit('update:lineForm', updatedForm);
});

// Watch for changes in proveedores prop
watch(() => props.proveedores, (newProveedores) => {
  // If we have a selected RUC, make sure the supplier still exists
  if (selectedSupplier.ruc && newProveedores.length > 0) {
    const found = newProveedores.find(p => p.ruc == selectedSupplier.ruc);
    if (!found) {
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
  // Obtener el valor seleccionado y convertirlo a null si es 'null' o undefined
  const selectedRuc = event?.target?.value === 'null' || event?.target?.value === null || event?.target?.value === undefined || event?.target?.value === '' 
    ? null 
    : event.target.value;
  
  // Encontrar el proveedor seleccionado
  const selectedProveedor = selectedRuc 
    ? props.proveedores.find(p => p.ruc == selectedRuc)
    : null;
    
  // Actualizar el formulario local
  const updatedForm = {
    ...props.lineForm,
    proveedorRuc: selectedRuc,
    proveedorNombre: selectedProveedor?.nombre || null,
    ruc: selectedRuc // Asegurarse de que ruc sea null si no hay proveedor
  };
  
  // Actualizar el objeto reactivo para la UI
  selectedSupplier.ruc = selectedRuc;
  selectedSupplier.nombre = selectedProveedor?.nombre || null;
  
  // Emitir el evento de actualización con el formulario completo
  emit('update:lineForm', updatedForm);
};

const handleSave = (e) => {
  e.preventDefault();
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
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ editingLine ? 'Editar Línea' : 'Nueva Línea' }}</h3>
        <button @click="handleClose" class="close-button">
          <X class="icon" />
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSave">
          <div class="form-group">
            <label class="required">Nombre</label>
            <div class="input-wrapper">
              <input 
                v-model="lineForm.nombre" 
                type="text" 
                :class="{ 'input-error': lineErrors && lineErrors.nombre }"
                placeholder="Ingrese el nombre de la línea"
                @input="emit('clear-error', 'nombre')"
              >
            </div>
            <transition name="fade">
              <div v-if="lineErrors && lineErrors.nombre" class="error-message">
                {{ lineErrors.nombre }}
              </div>
            </transition>
          </div>

          <!-- Supplier Selection -->
          <div class="form-group">
            <label>Proveedor</label>
            <div class="relative">
              <select 
                v-model="lineForm.proveedorRuc" 
                @change="handleProveedorChange"
                class="w-full"
                :class="{ error: lineErrors.proveedorId }"
              >
                <option :value="null">Sin proveedor</option>
                <option 
                  v-for="proveedor in proveedores" 
                  :key="proveedor.ruc" 
                  :value="proveedor.ruc"
                >
                  {{ proveedor.nombre }}
                </option>
              </select>
            </div>
            <span v-if="lineErrors.proveedorId" class="error-message">{{ lineErrors.proveedorId }}</span>
          </div>
          <div class="modal-actions">
            <button type="button" @click="handleClose" class="button secondary">Cancelar</button>
            <button type="submit" class="button primary">{{ editingLine ? 'Actualizar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/components/LineModal.css';

/* Estilos para el input personalizado */
.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1a1a1a;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #15803d;
  box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1);
}

.input-wrapper.input-error input {
  border-color: #dc2626;
}

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
