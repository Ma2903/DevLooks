import { createRouter, createWebHistory } from 'vue-router';

// Importa os componentes
import Home from './components/Home.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import EditUser from './components/EditUser.vue';
import ResetPassword from './components/ResetPassword.vue';
import Profile from './components/Profile.vue';
import SingleProduto from './pages/singleProduto.vue';
import AdminProducts from './pages/AdminProducts.vue';
import addProduto from './pages/addProduto.vue';
import EditProduto from './pages/editProduto.vue';
import ProductList from './pages/ProductList.vue'; // Corrigido o caminho
import Cart from './components/Cart.vue';
import Checkout from './pages/Checkout.vue';
import ConfirmReset from './components/ConfirmReset.vue';

// Define as rotas
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/create-avatar', name: 'CreateAvatar', component: CreateAvatar },
  { path: '/register', name: 'Register', component: Register },
  { path: '/edit-user', name: 'EditUser', component: EditUser },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/products', name: 'Products', component: ProductList }, // Rota para a lista de produtos
  { path: '/product/:id', name: 'SingleProduto', component: SingleProduto }, // Rota para o produto único
  { path: '/admin/products', name: 'AdminProducts', component: AdminProducts },
  { path: '/admin/products/add', name: 'AddProduct', component: addProduto },
  { path: '/admin/products/edit/:id', name: 'EditProduct', component: EditProduto, props: true },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/confirm-reset', name: 'ConfirmReset', component: ConfirmReset },
];

// Cria o roteador
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard global
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;