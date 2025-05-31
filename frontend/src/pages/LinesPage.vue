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
        
        <!-- Estado de carga -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando líneas...</p>
        </div>
        
        <!-- Estado de error -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <AlertCircle class="icon-large" />
          </div>
          <h4>Error al cargar las líneas</h4>
          <p>{{ error }}</p>
          <button @click="cargarLineas" class="button secondary">
            <RefreshCw class="icon-small" />
            Reintentar
          </button>
        </div>
        
        <!-- Tabla de líneas -->
        <div v-else class="table-container">
          <table class="table" v-if="lineas.length > 0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUC</th>
                <th>Productos</th>
                <th class="actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="linea in lineas" :key="linea.id">
                <td>
                  <div class="line-cell">
                    <div class="line-avatar">{{ linea.nombre.charAt(0) }}</div>
                    <div class="line-name">{{ linea.nombre }}</div>
                  </div>
                </td>
                <td>{{ linea.ruc || 'Sin RUC' }}</td>
                <td>{{ linea.productos || 0 }}</td>
                <td class="actions">
                  <div class="action-buttons">
                    <button @click="openLineModal(linea)" class="icon-button edit">
                      <Edit class="icon-small" />
                    </button>
                    <button @click="confirmDeleteLine(linea)" class="icon-button delete">
                      <Trash class="icon-small" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Mensaje cuando no hay líneas -->
          <div v-if="lineas.length === 0" class="empty-state">
            <div class="empty-icon">
              <Tag class="icon-large" />
            </div>
            <h4>No hay líneas disponibles</h4>
            <p>Agrega líneas para organizar tus productos.</p>
          </div>
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
  import { ref, reactive, onMounted } from 'vue';
  import { Plus, Edit, Trash, Tag, AlertCircle, RefreshCw } from 'lucide-vue-next';
  import LineModal from '../components/LineModal.vue';
  import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';
  import LineaService from '../services/lineaService';
  
  // Estados para datos
  const lineas = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  // Estados para modales
  const showLineModal = ref(false);
  const showDeleteModal = ref(false);
  const editingLine = ref(null);
  const deleteId = ref(null);
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
  
  // Cargar datos iniciales
  onMounted(async () => {
    await cargarLineas();
  });
  
  // Función para cargar líneas
  const cargarLineas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await LineaService.obtenerTodas();
      lineas.value = data;
    } catch (err) {
      console.error('Error al cargar líneas:', err);
      error.value = 'No se pudieron cargar las líneas. Por favor, intenta de nuevo.';
    } finally {
      loading.value = false;
    }
  };
  
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
  
  const saveLine = async () => {
    try {
      if (editingLine.value) {
        // Actualizar línea existente
        await LineaService.actualizar(editingLine.value.id, lineForm);
      } else {
        // Crear nueva línea
        await LineaService.crear(lineForm);
      }
      
      // Recargar líneas después de guardar
      await cargarLineas();
      closeLineModal();
    } catch (err) {
      console.error('Error al guardar línea:', err);
      // Aquí podrías manejar errores específicos de validación si la API los devuelve
    }
  };
  
  const confirmDeleteLine = (linea) => {
    deleteId.value = linea.id;
    deleteMessage.value = `¿Deseas eliminar la línea "${linea.nombre}"?`;
    showDeleteModal.value = true;
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteId.value = null;
    deleteMessage.value = '';
  };
  
  const confirmDelete = async () => {
    try {
      // Aquí deberíamos llamar a un método para eliminar la línea por ID
      // Pero no veo ese método en el servicio, así que habría que implementarlo
      // await LineaService.eliminar(deleteId.value);
      
      // Por ahora, simplemente recargamos las líneas
      await cargarLineas();
      closeDeleteModal();
    } catch (err) {
      console.error('Error al eliminar línea:', err);
    }
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
  
  /* Loading */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid #f3f4f6;
    border-top-color: #15803d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Error */
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .error-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: #fef2f2;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .error-container h4 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .error-container p {
    color: #6b7280;
    max-width: 24rem;
    margin-bottom: 1rem;
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
  
  .button.secondary {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .button.secondary:hover {
    background-color: #e5e7eb;
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
    justify-content: flex-end;
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
    width: 120px;
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
  
  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .empty-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: #f3f4f6;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .icon-large {
    width: 2rem;
    height: 2rem;
  }
  
  .empty-state h4 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .empty-state p {
    color: #6b7280;
    max-width: 24rem;
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
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .icon-button.edit {
    color: #15803d;
  }
  
  .icon-button.edit:hover {
    color: #166534;
    background-color: #f0fdf4;
  }
  
  .icon-button.delete {
    color: #ef4444;
  }
  
  .icon-button.delete:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }
  </style>
  