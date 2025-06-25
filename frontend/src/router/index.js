import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ProductsPage from '../pages/ProductsPage.vue';
import CategoriesPage from '../pages/CategoriesPage.vue';
import LinesPage from '../pages/LinesPage.vue';
import ProveedoresPage from '../pages/ProveedoresPage.vue';
import LoginPage from '../pages/LoginPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false, hideLayout: true }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/lineas',
    name: 'Lineas',
    component: LinesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/proveedores',
    name: 'Proveedores',
    component: ProveedoresPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login');
      return;
    }
    
    // Solo verificar token si no venimos de login y no acabamos de hacer login
    if (from.path !== '/login' && !authStore.justLoggedIn) {
      const isValid = await authStore.verifyToken();
      if (!isValid) {
        next('/login');
        return;
      }
    }
  }
  
  // Si está autenticado y trata de ir al login, redirigir al dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/productos');
    return;
  }
  
  next();
});

export default router;
