// view/router.js
import { createRouter, createWebHistory } from 'vue-router';

// Importa os componentes principais
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';
import EditUser from './components/EditUser.vue';
import Cart from './components/Cart.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import ResetPassword from './components/ResetPassword.vue';
import ConfirmReset from './components/ConfirmReset.vue';

// Importa páginas de produtos
import ProductList from './pages/ProductList.vue';
import SingleProduto from './pages/singleProduto.vue';
import OrderHistory from './pages/OrderHistory.vue';

// Importa páginas de Admin
import AdminUsers from './pages/AdminUsers.vue';
import EditUserAdmin from './pages/EditUserAdmin.vue';
import AdminProducts from './pages/AdminProducts.vue';
import addProduto from './pages/addProduto.vue';
import EditProduto from './pages/editProduto.vue';
import AdminCoupons from './pages/AdminCoupons.vue';
import CouponForm from './pages/CouponForm.vue';
import EditCoupon from './pages/editCoupon.vue';
import AdminOrders from './pages/AdminOrders.vue';

// Importa páginas de Checkout
import CheckoutWrapper from './pages/checkout/CheckoutWrapper.vue';
import CheckoutAddress from './pages/checkout/CheckoutAddress.vue';
import CheckoutReview from './pages/checkout/CheckoutReview.vue';
import CheckoutPayment from './pages/checkout/CheckoutPayment.vue';

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
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'SingleProduto', component: SingleProduto },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/confirm-reset', name: 'ConfirmReset', component: ConfirmReset },
  { path: '/order-history', name: 'OrderHistory', component: OrderHistory, meta: { requiresAuth: true } },

  // --- ESTRUTURA DE CHECKOUT CORRIGIDA ---
  {
    path: '/checkout',
    component: CheckoutWrapper,
    meta: { requiresAuth: true },
    children: [
      // CORREÇÃO: Redireciona a rota pai '/checkout' para a primeira etapa, 'address'
      { path: '', redirect: 'address' }, 
      { path: 'address', name: 'CheckoutAddress', component: CheckoutAddress },
      { path: 'review', name: 'CheckoutReview', component: CheckoutReview },
      { path: 'payment', name: 'CheckoutPayment', component: CheckoutPayment },
    ]
  },

  // Rotas de Admin
  { path: '/admin/users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAuth: true } },
  { path: '/admin/users/edit/:id', name: 'EditUserAdmin', component: EditUserAdmin, meta: { requiresAuth: true }, props: true },
  { path: '/admin/products', name: 'AdminProducts', component: AdminProducts, meta: { requiresAuth: true } },
  { path: '/admin/products/add', name: 'AddProduct', component: addProduto, meta: { requiresAuth: true } },
  { path: '/admin/products/edit/:id', name: 'EditProduct', component: EditProduto, meta: { requiresAuth: true }, props: true },
  { path: '/admin/coupons', name: 'AdminCoupons', component: AdminCoupons, meta: { requiresAuth: true } },
  { path: '/admin/coupons/add', name: 'AddCoupon', component: CouponForm, meta: { requiresAuth: true } },
  { path: '/admin/coupons/edit/:id', name: 'EditCoupon', component: EditCoupon, meta: { requiresAuth: true }, props: true },
  { path: '/admin/orders', name: 'AdminOrders', component: AdminOrders, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;