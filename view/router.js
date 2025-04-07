import { createRouter, createWebHistory } from 'vue-router';

// Importa os componentes
import Home from './components/Home.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import EditUser from './components/EditUser.vue';
import ResetPassword from './components/ResetPassword.vue';
import Profile from './components/Profile.vue';
import SingleProduct from './pages/singleProduto.vue';
import AdminProducts from './pages/AdminProducts.vue';
import addProduto from './pages/addProduto.vue';
import EditProduto from './pages/editProduto.vue';

// Define as rotas
const routes = [
  { path: '/', redirect: '/login' }, // Redireciona a rota inicial para o login
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/create-avatar', name: 'CreateAvatar', component: CreateAvatar },
  { path: '/register', name: 'Register', component: Register },
  { path: '/edit-user', name: 'EditUser', component: EditUser },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/product/:id',name : 'Product', component: SingleProduct }, // Rota para o produto único
  { path: '/admin/products', name: 'AdminProducts', component: AdminProducts },
  { path: '/admin/products/add', name: 'AddProduct', component: addProduto },
  { path: '/admin/products/edit/:id', name: 'EditProduct', component: EditProduto, props: true }, // Passa o id como prop para o componente EditProduto
];

// Cria o roteador
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;