import { ref, onMounted } from "vue"
import ProductoService from "../services/productoService"
import CategoriaService from "../services/categoriaService"
import LineaService from "../services/lineaService"
import ProveedorService from "../services/proveedorService"

export function useProductos() {
  const productos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const cargarProductos = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await ProductoService.obtenerTodos()
      productos.value = data
    } catch (err) {
      error.value = "Error al cargar los productos"

    } finally {
      loading.value = false
    }
  }

  const crearProducto = async (productoData) => {
    try {
      const nuevoProducto = await ProductoService.crear(productoData)
      productos.value.push(nuevoProducto)
      return nuevoProducto
    } catch (err) {
      error.value = "Error al crear el producto"
      throw err
    }
  }

  const actualizarProducto = async (id, productoData) => {
    try {
      const productoActualizado = await ProductoService.actualizar(id, productoData)
      const index = productos.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        productos.value[index] = productoActualizado
      }
      return productoActualizado
    } catch (err) {
      error.value = "Error al actualizar el producto"
      throw err
    }
  }

  const verificarNombreProducto = async (nombre) => {
    try {
      return await ProductoService.verificarNombre(nombre)
    } catch (err) {
      return { existe: false }
    }
  }

  onMounted(() => {
    cargarProductos()
  })

  return {
    productos,
    loading,
    error,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    verificarNombreProducto,
  }
}

export function useCategorias() {
  const categorias = ref([])
  const loading = ref(false)
  const error = ref(null)

  const cargarCategorias = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await CategoriaService.obtenerTodas()
      categorias.value = data
    } catch (err) {
      error.value = "Error al cargar las categorías"

    } finally {
      loading.value = false
    }
  }

  const crearCategoria = async (categoriaData) => {
    try {
      const nuevaCategoria = await CategoriaService.crear(categoriaData)
      categorias.value.push(nuevaCategoria)
      return nuevaCategoria
    } catch (err) {
      error.value = "Error al crear la categoría"
      throw err
    }
  }

  const actualizarCategoria = async (id, categoriaData) => {
    try {
      const categoriaActualizada = await CategoriaService.actualizar(id, categoriaData)
      const index = categorias.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        categorias.value[index] = categoriaActualizada
      }
      return categoriaActualizada
    } catch (err) {
      error.value = "Error al actualizar la categoría"
      throw err
    }
  }

  const verificarNombreCategoria = async (nombre) => {
    try {
      return await CategoriaService.verificarNombre(nombre)
    } catch (err) {
      return { existe: false }
    }
  }

  return {
    categorias,
    loading,
    error,
    cargarCategorias,
    crearCategoria,
    actualizarCategoria,
    verificarNombreCategoria,
  }
}

export function useLineas() {
  const lineas = ref([])
  const proveedores = ref([])
  const loading = ref(false)
  const error = ref(null)

  const cargarLineas = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await LineaService.obtenerTodas()
      // Mapear los campos del API a los nombres que usamos en la UI
      lineas.value = data.map((linea) => ({
        id: linea.cod_linea,
        nombre: linea.nombre_linea,
        ruc: linea.ruc,
        proveedor: linea.proveedor,
      }))
    } catch (err) {
      error.value = "Error al cargar las líneas"
      // Error cargando líneas
    } finally {
      loading.value = false
    }
  }

  const crearLinea = async (lineaData) => {
    loading.value = true
    error.value = null
    try {

      const response = await LineaService.crear(lineaData)
      
      // Si la respuesta es exitosa, recargar la lista de líneas
      if (response && response.resultado) {
        await cargarLineas()
        return response
      } else {
        throw new Error(response?.mensaje || 'Error al crear la línea')
      }
    } catch (err) {
      error.value = err.message || "Error al crear la línea"
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizarLinea = async (id, lineaData) => {
    loading.value = true;
    error.value = null;
    
    try {

      
      // Mapear los campos de la UI a los nombres que espera el API
      const dataParaAPI = {
        nombre_linea: lineaData.nombre_linea || lineaData.nombre, // Aceptar ambos formatos
        ruc: lineaData.hasOwnProperty('ruc') ? lineaData.ruc : null, // Asegurar que se envíe null si no hay RUC
        // No incluir proveedor si no es necesario en el backend
      };
      
      const response = await LineaService.actualizar(id, dataParaAPI);
      
      // Si la respuesta es exitosa, recargar la lista de líneas
      if (response && (response.resultado || response.cod_linea)) {
        await cargarLineas();
        return response;
      } else {
        throw new Error(response?.mensaje || 'Error al actualizar la línea');
      }
    } catch (err) {

      error.value = err.message || 'Error al actualizar la línea';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Verificar si un nombre de línea ya existe
  const verificarNombreLinea = async (nombre) => {
    try {
      if (!nombre || typeof nombre !== 'string') {
        return { resultado: false };
      }
      
      const response = await LineaService.verificarNombre(nombre);
      return {
        resultado: response.resultado || false,
        mensaje: response.mensaje || 'Ya existe una línea con este nombre',
        data: response.data || null
      };
    } catch (error) {

      return { 
        resultado: false,
        mensaje: 'Error al verificar el nombre de la línea'
      };
    }
  };

  const cargarProveedores = async () => {
    try {

      const data = await ProveedorService.obtenerTodos();
      
      if (!Array.isArray(data)) {
        // Se esperaba un array de proveedores pero se recibió un tipo diferente
        return;
      }
      

      
      // Mapear los proveedores asegurando que el RUC esté presente
      const mappedProveedores = data.map(proveedor => {
        // Asegurarse de que el RUC existe, si no, usar un valor por defecto
        const ruc = proveedor.ruc || proveedor.RUC || 'SIN_RUC';
        const nombre = proveedor.nombre || proveedor.nombre_proveedor || 'Proveedor sin nombre';
        

        
        return {
          id: ruc, // Usar RUC como ID
          nombre: nombre,
          ruc: ruc
        };
      });
      
      proveedores.value = mappedProveedores;

    } catch (err) {
      // Error al cargar proveedores
    }
  }

  // Load initial data
  cargarLineas()
  cargarProveedores()

  return {
    lineas,
    proveedores,
    loading,
    error,
    cargarLineas,
    cargarProveedores,
    crearLinea,
    actualizarLinea,
    verificarNombreLinea,
  }
}
