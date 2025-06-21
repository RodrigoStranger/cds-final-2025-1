import { createRouter, createWebHistory } from 'vue-router';
import ProductsPage from '../pages/ProductsPage.vue';
import CategoriesPage from '../pages/CategoriesPage.vue';
import LinesPage from '../pages/LinesPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/productos'
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductsPage
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriesPage
  },
  {
    path: '/lineas',
    name: 'Lineas',
    component: LinesPage
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

export default router;
