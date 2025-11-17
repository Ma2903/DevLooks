// view/router.js

import { createRouter, createWebHistory } from 'vue-router';
// Seus imports de componentes estão corretos e foram mantidos
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
import AboutProject from './pages/AboutProject.vue';
import PrivacyPolicy from './pages/PrivacyPolicy.vue';
import TermsOfService from './pages/TermsOfService.vue';
import CheckoutWrapper from './pages/checkout/CheckoutWrapper.vue';
import CheckoutAddress from './pages/checkout/CheckoutAddress.vue';
import CheckoutReview from './pages/checkout/CheckoutReview.vue';
import CheckoutPayment from './pages/checkout/CheckoutPayment.vue';
import Wishlist from './pages/Wishlist.vue';
import PaymentSuccess from './pages/PaymentSuccess.vue';
import PaymentFailure from './pages/PaymentFailure.vue';
import PaymentPending from './pages/PaymentPending.vue';

// Sua estrutura de rotas está ótima e foi mantida
const routes = [
  // Rotas Públicas
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'SingleProduct', component: SingleProduct, props: true },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/reset/confirm', name: 'ConfirmReset', component: ConfirmReset },
  { path: '/about', name: 'AboutUs', component: AboutUs },
  { path: '/faq', name: 'FAQ', component: FAQ },
  { path: '/project', name: 'AboutProject', component: AboutProject },
  { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/terms', name: 'TermsOfService', component: TermsOfService },
  
  // Rotas Protegidas
  { path: '/create-avatar', component: CreateAvatar, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/wishlist', component: Wishlist, meta: { requiresAuth: true } },
  { path: '/my-orders', component: OrderHistory, meta: { requiresAuth: true } },
  { path: '/edit-user/:id', component: EditUser, meta: { requiresAuth: true } },

  // Rota de Checkout com filhas
  { 
    path: '/checkout', 
    component: CheckoutWrapper, 
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/checkout/address' },
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
  
  // Rotas de retorno do pagamento (públicas)
  { path: '/order/success', name: 'PaymentSuccess', component: PaymentSuccess },
  { path: '/order/failure', name: 'PaymentFailure', component: PaymentFailure },
  { path: '/order/pending', name: 'PaymentPending', component: PaymentPending },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0 };
  },
});

// --- INÍCIO DA CORREÇÃO NA LÓGICA DE PROTEÇÃO DE ROTAS ---
router.beforeEach((to, from, next) => {
  // 1. Pega as informações do localStorage de forma segura
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('userData'); // Padronizado para 'userData'
  let user = null;

  // 2. Tenta fazer o parse do usuário APENAS se ele existir e for válido
  if (userString && userString !== 'undefined') {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      // Se o JSON no localStorage estiver corrompido, limpa tudo
      console.error("Erro ao analisar dados do usuário, limpando sessão:", e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  // 3. Define as regras de acesso com base nas metas da rota
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // 4. Lógica de redirecionamento
  if ((requiresAuth || requiresAdmin) && !user) {
    // Se a rota é protegida (para usuário ou admin) e não há usuário logado, vai para o login
    next({ name: 'Login' });
  } else if (requiresAdmin && user.role !== 'admin' && user.role !== 'owner') {
    // Se a rota é de admin, mas o usuário não tem a permissão, vai para a home
    next({ name: 'Home' });
  } else if ((to.name === 'Login' || to.name === 'Register') && user) {
    // Se o usuário já está logado, não deixa ele ver as páginas de login/registro
    next({ name: 'Profile' });
  } else {
    // Em todos os outros casos, permite a navegação
    next();
  }
});

export default router;