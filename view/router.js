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
import CheckoutWrapper from './pages/checkout/CheckoutWrapper.vue';
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

const routes = [
  // <<-- ROTAS PÚBLICAS (Acessíveis para todos) -->>
  { path: '/', name: 'Home', component: Home }, // A Home agora é pública
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'SingleProduct', component: SingleProduct, props: true },
  { path: '/reset-password', component: ResetPassword },
  { path: '/reset/:token', component: ConfirmReset },
  { path: '/about', name: 'AboutUs', component: AboutUs },
  { path: '/faq', name: 'FAQ', component: FAQ },
  
  // <<-- ROTAS PROTEGIDAS (Exigem login) -->>
  { path: '/create-avatar', component: CreateAvatar, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/checkout', component: CheckoutWrapper, meta: { requiresAuth: true } },
  { path: '/my-orders', component: OrderHistory, meta: { requiresAuth: true } },
  { path: '/edit-user/:id', component: EditUser, meta: { requiresAuth: true } },
  
  // <<-- ROTAS DE ADMIN (Exigem login e permissão de admin/owner) -->>
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
  const userStr = localStorage.getItem('user');
  let user = null;
  if(userStr) user = JSON.parse(userStr);

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // 1. Se a rota precisa de login E o usuário não tem token, redireciona para a página de login.
  if (requiresAuth && !token) {
    next('/login');
  } 
  // 2. Se a rota precisa de permissão de admin E o usuário não é admin/owner, redireciona para a home.
  else if (requiresAdmin && (!user || (user.role !== 'admin' && user.role !== 'owner'))) {
    next('/');
  }
  // 3. Se o usuário já está logado e tenta acessar as páginas de Login ou Registro, redireciona para o perfil.
  else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next('/profile');
  }
  // 4. Em todos os outros casos, permite a navegação.
  else {
    next();
  }
});

export default router;