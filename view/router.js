import { createRouter, createWebHistory } from 'vue-router';

// Importa os componentes
import Home from './components/Home.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import EditUser from './components/EditUser.vue';
import ResetPassword from './components/ResetPassword.vue';
import Profile from './components/Profile.vue';

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
];

// Cria o roteador
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;