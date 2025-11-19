<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import MobileBottomNav from './components/MobileBottomNav.vue';
import AcademicBanner from './components/AcademicBanner.vue';
import Swal from 'sweetalert2';

// ⚡ PERFORMANCE: FontAwesome carregado de forma assíncrona apenas o CSS
const loadFontAwesome = async () => {
  try {
    await import('@fortawesome/fontawesome-free/css/all.min.css');
  } catch (error) {
    console.error('Erro ao carregar FontAwesome:', error);
  }
};

const currentPage = ref('login');
const user = ref(null);

const navigateTo = (page) => {
  currentPage.value = page;
};

const handleLogin = (userData) => {
  user.value = userData;
  currentPage.value = 'home';
};

const navigateToUrl = (url) => {
  // window.location.href = 'http://localhost:5173/' + url;
};

// Listener para detectar quando o token expira (disparado pelo interceptor do axios)
const handleAuthChange = () => {
  const token = localStorage.getItem('token');
  if (!token && user.value) {
    // Token foi removido mas usuário ainda estava logado - significa que expirou
    user.value = null;
    Swal.fire({
      title: 'Sessão Expirada',
      text: 'Sua sessão expirou. Por favor, faça login novamente.',
      icon: 'warning',
      confirmButtonText: 'Ok, entendi',
      background: '#1F2937',
      color: '#E5E7EB',
      confirmButtonColor: '#10B981'
    });
  }
};

onMounted(() => {
  loadFontAwesome(); // Carrega FontAwesome de forma assíncrona
  navigateToUrl('login');
  window.addEventListener('auth-change', handleAuthChange);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', handleAuthChange);
});
</script>

<template>
  <div>
    <!-- 🎓 Banner de aviso acadêmico (topo fixo) -->
    <AcademicBanner />
    
    <Header :user="user" @navigate="navigateTo" />
    <main class="mt-0 pb-20 md:pb-0">
      <router-view :user="user" @login="handleLogin" />
    </main>
    <Footer />
    
    <!-- 📱 Barra de navegação inferior mobile -->
    <MobileBottomNav />
  </div>
</template>