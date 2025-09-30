<template>
  <header class="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2 flex-shrink-0">
        <img src="@/assets/Logo.png" alt="DevLooks Logo" class="h-10">
        <span class="text-2xl font-bold text-white hidden sm:inline">DevLooks</span>
      </router-link>

      <nav class="hidden lg:flex items-center space-x-6">
        <router-link to="/" class="nav-link flex items-center"><i class="fas fa-home w-5"></i> Home</router-link>
        <router-link to="/products" class="nav-link flex items-center"><i class="fas fa-box-open w-5"></i> Produtos</router-link>
        <router-link to="/create-avatar" class="nav-link flex items-center"><i class="fas fa-paint-brush w-5"></i> Criar Avatar</router-link>
        <router-link to="/about" class="nav-link flex items-center"><i class="fas fa-users w-5"></i> Sobre Nós</router-link>
        <router-link to="/faq" class="nav-link flex items-center"><i class="fas fa-question-circle w-5"></i> FAQ</router-link>
      </nav>

      <div class="hidden md:flex items-center space-x-6">
        <router-link to="/cart" class="relative hover:text-emerald-400 transition-colors">
          <i class="fas fa-shopping-cart text-xl"></i>
          <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{ cartItemCount }}</span>
        </router-link>
        
        <div v-if="user" class="relative">
          <button @click="toggleDropdown" class="flex items-center gap-2">
            <img :src="user.avatarUrl || 'https://i.pravatar.cc/40'" alt="User Avatar" class="w-8 h-8 rounded-full object-cover border-2 border-gray-600">
          </button>
          <transition name="fade-scale">
            <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg py-2 z-50 border border-gray-600">
              <div class="px-4 py-2 border-b border-gray-600">
                <p class="text-sm font-semibold text-white truncate">{{ user.name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
              </div>
              <router-link to="/profile" @click="isDropdownOpen = false" class="dropdown-item"><i class="fas fa-user-circle w-5"></i> Meu Perfil</router-link>
              <router-link to="/my-orders" @click="isDropdownOpen = false" class="dropdown-item"><i class="fas fa-receipt w-5"></i> Minhas Compras</router-link>
              
              <div v-if="isAdmin" class="border-t border-gray-600 mt-2 pt-2">
                <router-link to="/admin/products" @click="isDropdownOpen = false" class="dropdown-item"><i class="fas fa-box-open w-5"></i> Gerenciar Produtos</router-link>
                <router-link to="/admin/users" @click="isDropdownOpen = false" class="dropdown-item"><i class="fas fa-users-cog w-5"></i> Gerenciar Usuários</router-link>
                <router-link to="/admin/orders" @click="isDropdownOpen = false" class="dropdown-item"><i class="fas fa-dollar-sign w-5"></i> Gerenciar Vendas</router-link>
                <router-link to="/admin/coupons" @click="isDropdownOpen = false" class="dropdown-item"><i class="fas fa-tags w-5"></i> Gerenciar Cupons</router-link>
              </div>
              <a @click="logout" href="#" class="dropdown-item mt-2 border-t border-gray-600"><i class="fas fa-sign-out-alt w-5"></i> Sair</a>
            </div>
          </transition>
        </div>
        <router-link v-else to="/login" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Entrar
        </router-link>
      </div>
      
      <div class="md:hidden flex items-center">
        <router-link to="/cart" class="relative hover:text-emerald-400 transition-colors mr-4">
          <i class="fas fa-shopping-cart text-xl"></i>
           <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{ cartItemCount }}</span>
        </router-link>
        <button @click="isMobileMenuOpen = !isMobileMenuOpen">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>
    
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 absolute top-full left-0 w-full bg-gray-800 shadow-lg">
        <nav class="flex flex-col space-y-1 px-2 py-3">
          <div class="border-t border-gray-700 pt-4 mt-2">
              <div v-if="isAdmin" class="border-t border-gray-700 pt-2 mt-2">
                 <router-link to="/admin/products" class="mobile-link" @click="isMobileMenuOpen = false"><i class="fas fa-box-open w-6"></i> Gerenciar Produtos</router-link>
                 <router-link to="/admin/users" class="mobile-link" @click="isMobileMenuOpen = false"><i class="fas fa-users-cog w-6"></i> Gerenciar Usuários</router-link>
                 <router-link to="/admin/orders" class="mobile-link" @click="isMobileMenuOpen = false"><i class="fas fa-dollar-sign w-6"></i> Gerenciar Vendas</router-link>
                 <router-link to="/admin/coupons" class="mobile-link" @click="isMobileMenuOpen = false"><i class="fas fa-tags w-6"></i> Gerenciar Cupons</router-link>
              </div>
              <a v-if="user" @click="logout" href="#" class="mobile-link"><i class="fas fa-sign-out-alt w-6"></i> Sair</a>
              </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import SearchBar from './Search-bar.vue';

const router = useRouter();
const user = ref(null);
const cartItemCount = ref(0);
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);

// Propriedade computada para verificar se o usuário é admin
const isAdmin = computed(() => {
  return user.value && (user.value.role === 'admin' || user.value.role === 'owner');
});

const updateUserState = () => {
  const storedUser = localStorage.getItem('userData');
  user.value = storedUser ? JSON.parse(storedUser) : null;
  
  // A lógica do carrinho pode permanecer a mesma
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    const cart = JSON.parse(storedCart);
    cartItemCount.value = cart.reduce((total, item) => total + item.quantity, 0);
  } else {
    cartItemCount.value = 0;
  }
};

onMounted(() => {
  updateUserState();
  // Escuta por um evento 'auth-change' para se atualizar
  window.addEventListener('auth-change', updateUserState);
  window.addEventListener('cart-updated', updateCartCount);
});

// A função updateCartCount precisa ser definida também
const updateCartCount = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        const cart = JSON.parse(storedCart);
        cartItemCount.value = cart.reduce((total, item) => total + item.quantity, 0);
    } else {
        cartItemCount.value = 0;
    }
};


const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;

const handleSearch = (query) => {
  isMobileMenuOpen.value = false;
  router.push({ path: '/products', query: { q: query } });
};

const logout = () => {
  isDropdownOpen.value = false;
  isMobileMenuOpen.value = false;

  Swal.fire({
    title: 'Você tem certeza?', text: "Você será desconectado da sua conta.",
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#10B981',
    cancelButtonColor: '#EF4444', confirmButtonText: 'Sim, quero sair!',
    cancelButtonText: 'Cancelar', background: "#1F2937", color: "#E5E7EB"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // Dispara o evento para que o header se atualize
      window.dispatchEvent(new Event('auth-change'));
      router.push('/');

      Swal.fire({
        title: 'Desconectado!', text: 'Você saiu da sua conta com segurança.',
        icon: 'success', background: "#1F2937", color: "#E5E7EB",
        timer: 2000, showConfirmButton: false
      });
    }
  });
};

watch(() => router.currentRoute.value, () => {
  isMobileMenuOpen.value = false;
  isDropdownOpen.value = false;
});
</script>

<style scoped>
/* SEUS ESTILOS CONTINUAM AQUI... */
@import '@fortawesome/fontawesome-free/css/all.css';

.router-link-exact-active { color: #34d399; }
.nav-link { position: relative; transition: color 0.3s; }
.nav-link::after { content: ''; position: absolute; width: 100%; transform: scaleX(0); height: 2px; bottom: -4px; left: 0; background-color: #34d399; transform-origin: bottom right; transition: transform 0.3s ease-out; }
.nav-link:hover::after { transform: scaleX(1); transform-origin: bottom left; }
.nav-link.router-link-exact-active::after { transform: scaleX(1); transform-origin: bottom center; }
.dropdown-item { display: flex; align-items: center; padding-left: 1rem; padding-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 0.875rem; color: #e5e7eb; transition: background 0.2s, color 0.2s; }
.dropdown-item:hover { background-color: #10b981; color: #fff; }
.mobile-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-size: 1rem; font-weight: 500; color: #e5e7eb; transition: background 0.2s, color 0.2s; }
.mobile-link:hover { background-color: #374151; }
.mobile-link.router-link-exact-active { background-color: #10b981; color: #fff; }
.fade-scale-enter-active, .fade-scale-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { transform: scale(0.95) translateY(-10px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>