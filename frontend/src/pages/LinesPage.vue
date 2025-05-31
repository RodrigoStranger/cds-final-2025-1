<template>
    <div class="page-container">
      <div class="card">
        <div class="card-header">
          <div class="card-header-content">
            <h3>Líneas de Productos</h3>
            <button @click="openLineModal()" class="button primary">
              <Plus class="icon-small" />
              Nueva Línea
            </button>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUC</th>
                <th>Productos</th>
                <th class="actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(linea, index) in lineas" :key="index">
                <td>
                  <div class="line-cell">
                    <div class="line-avatar">{{ linea.nombre.charAt(0) }}</div>
                    <div class="line-name">{{ linea.nombre }}</div>
                  </div>
                </td>
                <td>{{ linea.ruc || 'Sin RUC' }}</td>
                <td>{{ linea.productos }}</td>
                <td class="actions">
                  <div class="action-buttons">
                    <button @click="openLineModal(linea)" class="icon-button edit">
                      <Edit class="icon-small" />
                    </button>
                    <button @click="confirmDeleteLine(index)" class="icon-button delete">
                      <Trash class="icon-small" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Modal para Líneas -->
      <LineModal
        :show="showLineModal"
        :editing-line="editingLine"
        :line-form="lineForm"
        :line-errors="lineErrors"
        @close="closeLineModal"
        @save="saveLine"
      />
  
      <!-- Modal de Confirmación -->
      <ConfirmDeleteModal
        :show="showDeleteModal"
        :message="deleteMessage"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { Plus, Edit, Trash } from 'lucide-vue-next';
  import LineModal from '../components/LineModal.vue';
  import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';
  
  // Estados para modales
  const showLineModal = ref(false);
  const showDeleteModal = ref(false);
  const editingLine = ref(null);
  const deleteIndex = ref(-1);
  const deleteMessage = ref('');
  
  // Formulario de línea
  const lineForm = reactive({
    nombre: '',
    ruc: ''
  });
  
  // Errores de validación
  const lineErrors = reactive({
    nombre: '',
    ruc: ''
  });
  
  // Datos de líneas
  const lineas = ref([
    { nombre: 'Hidratación', ruc: '20123456789', productos: 12 },
    { nombre: 'Esenciales', ruc: '20987654321', productos: 8 },
    { nombre: 'Limpieza', ruc: '20456789123', productos: 15 },
    { nombre: 'Tratamiento', ruc: '', productos: 7 },
    { nombre: 'Protección', ruc: '20321654987', productos: 5 }
  ]);
  
  // Funciones para líneas
  const openLineModal = (line = null) => {
    if (line) {
      editingLine.value = line;
      lineForm.nombre = line.nombre;
      lineForm.ruc = line.ruc || '';
    } else {
      editingLine.value = null;
      lineForm.nombre = '';
      lineForm.ruc = '';
    }
    showLineModal.value = true;
  };
  
  const closeLineModal = () => {
    showLineModal.value = false;
    editingLine.value = null;
    Object.keys(lineErrors).forEach(key => lineErrors[key] = '');
  };
  
  const saveLine = () => {
    if (editingLine.value) {
      const index = lineas.value.findIndex(l => l === editingLine.value);
      if (index !== -1) {
        lineas.value[index].nombre = lineForm.nombre;
        lineas.value[index].ruc = lineForm.ruc || '';
      }
    } else {
      lineas.value.push({
        nombre: lineForm.nombre,
        ruc: lineForm.ruc || '',
        productos: 0
      });
    }
    closeLineModal();
  };
  
  const confirmDeleteLine = (index) => {
    deleteIndex.value = index;
    deleteMessage.value = `¿Deseas eliminar la línea "${lineas.value[index].nombre}"?`;
    showDeleteModal.value = true;
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteIndex.value = -1;
    deleteMessage.value = '';
  };
  
  const confirmDelete = () => {
    lineas.value.splice(deleteIndex.value, 1);
    closeDeleteModal();
  };
  </script>
  
  <style scoped>
  .page-container {
    margin-top: 4rem;
  }
  
  @media (min-width: 768px) {
    .page-container {
      margin-top: 0;
    }
  }
  
  /* Card */
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }
  
  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .card-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .card-header h3 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
  }
  
  /* Button */
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
  
  .icon-small {
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;
  }
  
  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  /* Table */
  .table-container {
    overflow-x: auto;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f9fafb;
  }
  
  .table td {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #4b5563;
    border-top: 1px solid #e5e7eb;
  }
  
  .table th.actions, .table td.actions {
    text-align: right;
  }
  
  /* Line Cell */
  .line-cell {
    display: flex;
    align-items: center;
  }
  
  .line-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #f0fdf4;
    color: #15803d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    margin-right: 1rem;
  }
  
  .line-name {
    font-weight: 500;
    color: #111827;
  }
  
  /* Icon Buttons */
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #4b5563;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
  }
  
  .icon-button.edit {
    color: #15803d;
  }
  
  .icon-button.edit:hover {
    color: #166534;
  }
  
  .icon-button.delete {
    color: #ef4444;
  }
  
  .icon-button.delete:hover {
    color: #dc2626;
  }
  </style>
  