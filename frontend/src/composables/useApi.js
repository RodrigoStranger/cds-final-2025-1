import { ref, onMounted } from "vue"
import ProductoService from "../services/productoService"
import CategoriaService from "../services/categoriaService"
import LineaService from "../services/lineaService"

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
      console.error("Error cargando productos:", err)
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
      console.error("Error verificando nombre:", err)
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
      console.error("Error cargando categorías:", err)
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
      console.error("Error verificando nombre:", err)
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
      console.error("Error cargando líneas:", err)
    } finally {
      loading.value = false
    }
  }

  const crearLinea = async (lineaData) => {
    try {
      // Mapear los campos de la UI a los nombres que espera el API
      const dataParaAPI = {
        nombre_linea: lineaData.nombre,
        ruc: lineaData.ruc,
        proveedor: lineaData.proveedor || "",
      }
      const nuevaLinea = await LineaService.crear(dataParaAPI)
      // Mapear la respuesta del API al formato que usa la UI
      const lineaFormateada = {
        id: nuevaLinea.cod_linea,
        nombre: nuevaLinea.nombre_linea,
        ruc: nuevaLinea.ruc,
        proveedor: nuevaLinea.proveedor,
      }
      lineas.value.push(lineaFormateada)
      return lineaFormateada
    } catch (err) {
      error.value = "Error al crear la línea"
      throw err
    }
  }

  const actualizarLinea = async (id, lineaData) => {
    try {
      // Mapear los campos de la UI a los nombres que espera el API
      const dataParaAPI = {
        nombre_linea: lineaData.nombre,
        ruc: lineaData.ruc,
        proveedor: lineaData.proveedor || "",
      }
      const lineaActualizada = await LineaService.actualizar(id, dataParaAPI)
      // Mapear la respuesta del API al formato que usa la UI
      const lineaFormateada = {
        id: lineaActualizada.cod_linea,
        nombre: lineaActualizada.nombre_linea,
        ruc: lineaActualizada.ruc,
        proveedor: lineaActualizada.proveedor,
      }
      const index = lineas.value.findIndex((l) => l.id === id)
      if (index !== -1) {
        lineas.value[index] = lineaFormateada
      }
      return lineaFormateada
    } catch (err) {
      error.value = "Error al actualizar la línea"
      throw err
    }
  }

  const verificarNombreLinea = async (nombre) => {
    try {
      return await LineaService.verificarNombre(nombre)
    } catch (err) {
      console.error("Error verificando nombre:", err)
      return { existe: false }
    }
  }

  onMounted(() => {
    cargarLineas()
  })

  return {
    lineas,
    loading,
    error,
    cargarLineas,
    crearLinea,
    actualizarLinea,
    verificarNombreLinea,
  }
}
