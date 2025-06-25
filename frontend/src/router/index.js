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
    redirect: '/productos'
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
    redirect: '/productos'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  console.log('🧭 Navegando a:', to.path, 'Requiere auth:', to.meta.requiresAuth);
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('❌ No autenticado, redirigiendo a login');
      next('/login');
      return;
    }
    
    // Solo verificar token si no venimos de login y no acabamos de hacer login
    if (from.path !== '/login' && !authStore.justLoggedIn) {
      const isValid = await authStore.verifyToken();
      if (!isValid) {
        console.log('❌ Token inválido, redirigiendo a login');
        next('/login');
        return;
      }
    } else {
      console.log('✅ Omitiendo verificación de token (login reciente o desde /login)');
    }
  }
  
  // Si está autenticado y trata de ir al login, redirigir al dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    console.log('✅ Ya autenticado, redirigiendo al dashboard');
    next('/productos');
    return;
  }
  
  next();
});

export default router;
