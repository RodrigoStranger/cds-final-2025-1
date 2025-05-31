<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md hidden md:block">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-green-700">FabiaNatura</h1>
      </div>
      <nav class="mt-6">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index" 
          @click="activeTab = tab.id"
          class="px-6 py-3 flex items-center cursor-pointer transition-colors"
          :class="activeTab === tab.id ? 'bg-green-50 border-l-4 border-green-600 text-green-700' : 'text-gray-600 hover:bg-green-50'"
        >
          <component :is="tab.icon" class="h-5 w-5 mr-3" />
          <span>{{ tab.name }}</span>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm z-10">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center md:hidden">
            <button @click="toggleMobileMenu" class="text-gray-600">
              <Menu class="h-6 w-6" />
            </button>
            <h1 class="text-xl font-bold text-green-700 ml-3">FabiaNatura</h1>
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-600">
              <Bell class="h-5 w-5" />
            </button>
            <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              FN
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="px-4 border-b border-gray-200">
          <nav class="flex -mb-px">
            <div 
              v-for="(tab, index) in tabs" 
              :key="index" 
              @click="activeTab = tab.id"
              class="py-3 px-4 cursor-pointer border-b-2 font-medium text-sm"
              :class="activeTab === tab.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </div>
          </nav>
        </div>
      </header>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 md:hidden">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="toggleMobileMenu"></div>
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div class="p-4 flex items-center justify-between">
            <h1 class="text-xl font-bold text-green-700">FabiaNatura</h1>
            <button @click="toggleMobileMenu" class="text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <nav class="mt-4">
            <div 
              v-for="(tab, index) in tabs" 
              :key="index" 
              @click="selectMobileTab(tab.id)"
              class="px-6 py-3 flex items-center cursor-pointer"
              :class="activeTab === tab.id ? 'bg-green-50 border-l-4 border-green-600 text-green-700' : 'text-gray-600'"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-3" />
              <span>{{ tab.name }}</span>
            </div>
          </nav>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto">
          <!-- Tab Content -->
          <div v-if="activeTab === 'productos'" class="bg-white shadow rounded-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">Productos</h3>
                <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                  <Plus class="h-4 w-4 mr-1" />
                  Nuevo Producto
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(producto, index) in productos" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-md bg-gray-200 flex-shrink-0"></div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ producto.nombre }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ producto.categoria }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ producto.linea }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ producto.stock }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ producto.precio }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-green-600 hover:text-green-900 mr-3">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button class="text-red-600 hover:text-red-900">
                        <Trash class="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  Mostrando 1-5 de 25 productos
                </div>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 border border-gray-300 rounded-md text-sm">Anterior</button>
                  <button class="px-3 py-1 border border-gray-300 bg-green-50 text-green-600 rounded-md text-sm">1</button>
                  <button class="px-3 py-1 border border-gray-300 rounded-md text-sm">2</button>
                  <button class="px-3 py-1 border border-gray-300 rounded-md text-sm">3</button>
                  <button class="px-3 py-1 border border-gray-300 rounded-md text-sm">Siguiente</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'lineas'" class="bg-white shadow rounded-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">Líneas de Productos</h3>
                <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                  <Plus class="h-4 w-4 mr-1" />
                  Nueva Línea
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(linea, index) in lineas" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                          {{ linea.nombre.charAt(0) }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ linea.nombre }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ linea.descripcion }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ linea.productos }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="linea.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                        {{ linea.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-green-600 hover:text-green-900 mr-3">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button class="text-red-600 hover:text-red-900">
                        <Trash class="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTab === 'categorias'" class="bg-white shadow rounded-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">Categorías</h3>
                <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                  <Plus class="h-4 w-4 mr-1" />
                  Nueva Categoría
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              <div v-for="(categoria, index) in categorias" :key="index" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center text-green-700">
                      <component :is="categoria.icon" class="h-5 w-5" />
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">{{ categoria.nombre }}</h4>
                      <p class="text-xs text-gray-500">{{ categoria.productos }} productos</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-gray-400 hover:text-green-600">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button class="text-gray-400 hover:text-red-600">
                      <Trash class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Menu, 
  X, 
  Bell, 
  Package, 
  Tag, 
  Grid, 
  Plus, 
  Edit, 
  Trash, 
  Leaf, 
  Droplet, 
  Sun, 
  Heart, 
  Smile 
} from 'lucide-vue-next';

// Estado para el menú móvil
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const selectMobileTab = (tabId) => {
  activeTab.value = tabId;
  mobileMenuOpen.value = false;
};

// Pestañas
const activeTab = ref('productos');
const tabs = [
  { id: 'productos', name: 'Productos', icon: Package },
  { id: 'lineas', name: 'Líneas', icon: Tag },
  { id: 'categorias', name: 'Categorías', icon: Grid }
];

// Datos de ejemplo para productos
const productos = [
  { nombre: 'Crema Hidratante', categoria: 'Cuidado Facial', linea: 'Hidratación', stock: 45, precio: 29.99 },
  { nombre: 'Aceite Esencial de Lavanda', categoria: 'Aromaterapia', linea: 'Esenciales', stock: 32, precio: 15.50 },
  { nombre: 'Jabón de Aloe Vera', categoria: 'Cuidado Corporal', linea: 'Limpieza', stock: 78, precio: 8.75 },
  { nombre: 'Mascarilla de Arcilla', categoria: 'Cuidado Facial', linea: 'Tratamiento', stock: 21, precio: 18.99 },
  { nombre: 'Champú de Romero', categoria: 'Cuidado Capilar', linea: 'Limpieza', stock: 54, precio: 12.25 }
];

// Datos de ejemplo para líneas
const lineas = [
  { nombre: 'Hidratación', descripcion: 'Productos para hidratar la piel', productos: 12, activo: true },
  { nombre: 'Esenciales', descripcion: 'Aceites esenciales y aromaterapia', productos: 8, activo: true },
  { nombre: 'Limpieza', descripcion: 'Productos de limpieza corporal', productos: 15, activo: true },
  { nombre: 'Tratamiento', descripcion: 'Tratamientos específicos', productos: 7, activo: false },
  { nombre: 'Protección', descripcion: 'Protección solar y ambiental', productos: 5, activo: true }
];

// Datos de ejemplo para categorías
const categorias = [
  { nombre: 'Cuidado Facial', productos: 18, icon: Smile },
  { nombre: 'Cuidado Corporal', productos: 24, icon: Heart },
  { nombre: 'Aromaterapia', productos: 12, icon: Droplet },
  { nombre: 'Cuidado Capilar', productos: 9, icon: Leaf },
  { nombre: 'Protección Solar', productos: 6, icon: Sun },
  { nombre: 'Bienestar', productos: 15, icon: Heart }
];
</script>