<script setup>
import { ref } from 'vue';
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
</script>

<template>
  <div>
    <Header :user="user" @navigate="navigateTo" />
    <main class="mt-0">
      <component
        :is="currentPage === 'Home' ? Home 
          : currentPage === 'CreateAvatar' ? CreateAvatar 
          : currentPage === 'Register' ? Register 
          : currentPage === 'EditUser' ? EditUser
          : currentPage === 'ResetPassword' ? ResetPassword  
          : Login"
        @navigate="navigateTo"
        @login="handleLogin"
        :user="user"
      />
    </main>
    <Footer />
  </div>
</template>