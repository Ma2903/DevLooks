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
import ProductList from './pages/ProductList.vue';
import Cart from './components/Cart.vue';
import Checkout from './pages/Checkout.vue';
import ConfirmReset from './components/ConfirmReset.vue';
import AdminCoupons from './pages/AdminCoupons.vue';
import CouponForm from './pages/CouponForm.vue';
import EditCoupon from './pages/editCoupon.vue';

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
  
  // --- A CORREÇÃO ESTÁ AQUI ---
  { path: '/products/:id', name: 'SingleProduto', component: SingleProduto }, // Rota para o produto único (corrigida)

  { path: '/admin/products', name: 'AdminProducts', component: AdminProducts },
  { path: '/admin/products/add', name: 'AddProduct', component: addProduto },
  { path: '/admin/products/edit/:id', name: 'EditProduct', component: EditProduto, props: true },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/confirm-reset', name: 'ConfirmReset', component: ConfirmReset },
  { path: '/admin/coupons', name: 'AdminCoupons', component: AdminCoupons, meta: { requiresAuth: true } },
  { path: '/admin/coupons/add', name: 'AddCoupon', component: CouponForm, meta: { requiresAuth: true } },
  { path: '/admin/coupons/edit/:id', name: 'EditCoupon', component: EditCoupon, meta: { requiresAuth: true }, props: true },
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