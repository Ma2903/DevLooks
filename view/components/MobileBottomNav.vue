<template>
  <!-- 📱 Barra de Navegação Inferior Mobile (Bottom Navigation) -->
  <nav 
    v-if="isMobile"
    class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-gray-800 border-t border-gray-700 safe-area-bottom"
    role="navigation"
    aria-label="Navegação principal mobile"
  >
    <div class="flex items-center justify-around h-16 px-2">
      
      <!-- Home -->
      <router-link 
        to="/" 
        class="nav-item"
        :class="{ 'active': $route.path === '/' }"
        aria-label="Ir para Home"
      >
        <i class="fas fa-home text-xl"></i>
        <span class="text-xs mt-1">Home</span>
      </router-link>

      <!-- Buscar -->
      <router-link 
        to="/products" 
        class="nav-item"
        :class="{ 'active': $route.path === '/products' }"
        aria-label="Buscar produtos"
      >
        <i class="fas fa-search text-xl"></i>
        <span class="text-xs mt-1">Buscar</span>
      </router-link>

      <!-- Favoritos com badge -->
      <router-link 
        to="/wishlist" 
        class="nav-item"
        :class="{ 'active': $route.path === '/wishlist' }"
        aria-label="Ver favoritos"
      >
        <div class="relative">
          <i class="fas fa-heart text-xl"></i>
          <span 
            v-if="wishlistCount > 0" 
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            aria-label="`${wishlistCount} itens favoritados`"
          >
            {{ wishlistCount > 9 ? '9+' : wishlistCount }}
          </span>
        </div>
        <span class="text-xs mt-1">Favoritos</span>
      </router-link>

      <!-- Carrinho com badge -->
      <router-link 
        to="/cart" 
        class="nav-item"
        :class="{ 'active': $route.path === '/cart' }"
        aria-label="Ver carrinho"
      >
        <div class="relative">
          <i class="fas fa-shopping-cart text-xl"></i>
          <span 
            v-if="cartCount > 0" 
            class="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            aria-label="`${cartCount} itens no carrinho`"
          >
            {{ cartCount > 9 ? '9+' : cartCount }}
          </span>
        </div>
        <span class="text-xs mt-1">Carrinho</span>
      </router-link>

      <!-- Perfil/Login -->
      <router-link 
        :to="user ? '/profile' : '/login'" 
        class="nav-item"
        :class="{ 'active': $route.path === '/profile' || $route.path === '/login' }"
        :aria-label="user ? 'Ver perfil' : 'Fazer login'"
      >
        <i :class="user ? 'fas fa-user' : 'fas fa-sign-in-alt'" class="text-xl"></i>
        <span class="text-xs mt-1">{{ user ? 'Perfil' : 'Entrar' }}</span>
      </router-link>

    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/main.js';

const router = useRouter();
const user = ref(null);
const cartCount = ref(0);
const wishlistCount = ref(0);
const isMobile = ref(false);

// Detecta se é mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Atualiza contadores
const updateCounts = async () => {
  const userData = localStorage.getItem('userData');
  user.value = userData && userData !== 'undefined' ? JSON.parse(userData) : null;
  
  if (user.value) {
    try {
      // Busca carrinho
      const cartResponse = await api.get('/api/cart');
      cartCount.value = cartResponse.data.items?.length || 0;
      
      // Busca wishlist
      const wishlistResponse = await api.get('/api/wishlist');
      wishlistCount.value = wishlistResponse.data.products?.length || 0;
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
    }
  }
};

onMounted(() => {
  checkMobile();
  updateCounts();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('cart-updated', updateCounts);
  window.addEventListener('wishlist-updated', updateCounts);
  window.addEventListener('auth-change', updateCounts);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('cart-updated', updateCounts);
  window.removeEventListener('wishlist-updated', updateCounts);
  window.removeEventListener('auth-change', updateCounts);
});
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.mobile-bottom-nav {
  /* ⚡ PERFORMANCE: Hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
  
  /* 🎨 Glassmorphism effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(31, 41, 55, 0.95);
  
  /* Sombra para destacar */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

/* Safe area para dispositivos com notch */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  min-width: 64px;
  min-height: 48px;
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  position: relative;
  
  /* Touch otimizado */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: #04d1b0;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: linear-gradient(90deg, #04d1b0, #4e44e1);
  border-radius: 0 0 3px 3px;
}

/* Animação ao tocar */
.nav-item:hover {
  background: rgba(4, 209, 176, 0.1);
}

/* Badge animado */
.nav-item span[aria-label] {
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
