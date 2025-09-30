// view/router.js

import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import ProductList from './pages/ProductList.vue';
import SingleProduct from './pages/singleProduto.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import Profile from './components/Profile.vue';
import Cart from './components/Cart.vue';
import OrderHistory from './pages/OrderHistory.vue';
import ResetPassword from './components/ResetPassword.vue';
import ConfirmReset from './components/ConfirmReset.vue';
import EditUser from './components/EditUser.vue';
import AdminProducts from './pages/AdminProducts.vue';
import AddProduct from './pages/addProduto.vue';
import EditProduct from './pages/editProduto.vue';
import AdminUsers from './pages/AdminUsers.vue';
import EditUserAdmin from './pages/EditUserAdmin.vue';
import AdminOrders from './pages/AdminOrders.vue';
import AdminCoupons from './pages/AdminCoupons.vue';
import CouponForm from './pages/CouponForm.vue';
import AboutUs from './pages/AboutUs.vue';
import FAQ from './pages/FAQ.vue';

// --- ROTAS DO CHECKOUT (Importe os componentes de cada etapa) ---
import CheckoutWrapper from './pages/checkout/CheckoutWrapper.vue';
import CheckoutAddress from './pages/checkout/CheckoutAddress.vue';
import CheckoutReview from './pages/checkout/CheckoutReview.vue';
import CheckoutPayment from './pages/checkout/CheckoutPayment.vue';


const routes = [
  // Rotas Públicas
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'SingleProduct', component: SingleProduct, props: true },
  { path: '/reset-password', component: ResetPassword },
  { path: '/reset/:token', component: ConfirmReset },
  { path: '/about', name: 'AboutUs', component: AboutUs },
  { path: '/faq', name: 'FAQ', component: FAQ },
  
  // Rotas Protegidas
  { path: '/create-avatar', component: CreateAvatar, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/my-orders', component: OrderHistory, meta: { requiresAuth: true } },
  { path: '/edit-user/:id', component: EditUser, meta: { requiresAuth: true } },

  // --- CORREÇÃO PRINCIPAL AQUI: ROTA DE CHECKOUT COM FILHAS ---
  { 
    path: '/checkout', 
    component: CheckoutWrapper, 
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/checkout/address' }, // Redireciona /checkout para a primeira etapa
      { path: 'address', name: 'CheckoutAddress', component: CheckoutAddress },
      { path: 'review', name: 'CheckoutReview', component: CheckoutReview },
      { path: 'payment', name: 'CheckoutPayment', component: CheckoutPayment },
    ]
  },
  
  // Rotas de Admin
  { path: '/admin/products', component: AdminProducts, meta: { requiresAdmin: true } },
  { path: '/admin/products/add', component: AddProduct, meta: { requiresAdmin: true } },
  { path: '/admin/products/edit/:id', component: EditProduct, meta: { requiresAdmin: true } },
  { path: '/admin/users', component: AdminUsers, meta: { requiresAdmin: true } },
  { path: '/admin/users/edit/:id', component: EditUserAdmin, meta: { requiresAdmin: true } },
  { path: '/admin/orders', component: AdminOrders, meta: { requiresAdmin: true } },
  { path: '/admin/coupons', component: AdminCoupons, meta: { requiresAdmin: true } },
  { path: '/admin/coupons/new', component: CouponForm, meta: { requiresAdmin: true } },
  { path: '/admin/coupons/edit/:id', component: CouponForm, meta: { requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('userData'); // Corrigido para pegar 'userData'
  let user = null;
  if(userStr) user = JSON.parse(userStr);

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !token) {
    next('/login');
  } 
  else if (requiresAdmin && (!user || (user.role !== 'admin' && user.role !== 'owner'))) {
    next('/');
  }
  else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next('/profile');
  }
  else {
    next();
  }
});

export default router;