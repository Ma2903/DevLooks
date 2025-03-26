<script setup>
import { onMounted, ref } from 'vue';
import Home from './components/Home.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import EditUser from './components/EditUser.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import ResetPassword from './components/ResetPassword.vue';

const currentPage = ref('login'); // Página inicial alterada para 'login'
const user = ref(null); // Estado para armazenar os dados do usuário logado

const navigateTo = (page) => {
  currentPage.value = page;
};

const handleLogin = (userData) => {
  user.value = userData; // Armazena os dados do usuário logado
  currentPage.value = 'home'; // Redireciona para a página inicial
};

const navigateToUrl = (url) => {
  // window.location.href = 'http://localhost:5173/' + url;
};

onMounted (() => {
  navigateToUrl('login');
});
</script>

<template>
  <div>
    <Header :user="user" @navigate="navigateTo" />
    <main class="mt-0">
      <router-view :user="user" @login="handleLogin" />
    </main>
    <Footer />
  </div>
</template>