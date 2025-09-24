<template>
  <header class="bg-gray-900 text-white p-4 md:p-6 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      
      <router-link to="/home" class="flex items-center space-x-4">
        <img
          src="../assets/favicon.png"
          alt="Logo DevLooks"
          class="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg"
        />
        <div>
          <h1 class="text-3xl font-poppins font-bold tracking-wide">
            <span class="text-[#04d1b0]">Dev</span><span class="text-white">Looks</span>
          </h1>
        </div>
      </router-link>

      <button @click="toggleMenu" class="md:hidden text-3xl">
        <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>

      <nav
        :class="{'hidden': !menuOpen, 'flex': menuOpen}"
        class="absolute md:relative top-full left-0 w-full bg-gray-900 md:bg-transparent p-5 md:p-0 md:flex md:w-auto flex-col md:flex-row md:items-center md:space-x-4 text-lg"
      >
        <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <li>
            <router-link to="/home" class="nav-link"><i class="fas fa-home mr-2"></i>Home</router-link>
          </li>
          <li>
            <router-link to="/products" class="nav-link"><i class="fas fa-store mr-2"></i>Produtos</router-link>
          </li>

          <template v-if="isLoggedIn">
            <template v-if="userType === 'user'">
              <li><router-link to="/cart" class="nav-link"><i class="fas fa-shopping-cart mr-2"></i>Carrinho</router-link></li>
              <li><router-link to="/order-history" class="nav-link"><i class="fas fa-receipt mr-2"></i>Minhas Compras</router-link></li>
              <li><router-link to="/create-avatar" class="nav-link"><i class="fas fa-user-astronaut mr-2"></i>Criar Avatar</router-link></li>
            </template>
            
            <template v-if="userType === 'admin' || userType === 'owner'">
              <li><router-link to="/admin/products" class="nav-link"><i class="fas fa-cogs mr-2"></i>Gerir Produtos</router-link></li>
              <li><router-link to="/admin/coupons" class="nav-link"><i class="fas fa-tags mr-2"></i>Gerir Cupons</router-link></li>
              <li><router-link to="/admin/orders" class="nav-link"><i class="fas fa-dollar-sign mr-2"></i>Gerir Vendas</router-link></li>
            </template>
            
            <li v-if="userType === 'owner'">
              <router-link to="/admin/users" class="nav-link"><i class="fas fa-users mr-2"></i>Gerir Utilizadores</router-link>
            </li>
            
            <li><router-link to="/profile" class="nav-link"><i class="fas fa-user mr-2"></i>Perfil</router-link></li>
          </template>

          <li v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link"><i class="fas fa-sign-in-alt mr-2"></i>Entrar</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    // Inicializa o estado lendo do localStorage para evitar "piscadas" na tela
    const token = localStorage.getItem("token");
    const userDataRaw = localStorage.getItem("userData");
    let userType = 'guest';

    if (token && userDataRaw && userDataRaw !== "undefined") {
      try {
        const userData = JSON.parse(userDataRaw);
        userType = userData.role || 'user';
      } catch (e) {
        console.error("Erro ao parsear userData do localStorage", e);
      }
    }
    
    return {
      menuOpen: false,
      isLoggedIn: !!token,
      userType: userType,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    atualizarEstado() {
      const token = localStorage.getItem("token");
      const userDataRaw = localStorage.getItem("userData");
      this.isLoggedIn = !!token;

      if (this.isLoggedIn && userDataRaw && userDataRaw !== "undefined") {
        try {
          const userData = JSON.parse(userDataRaw);
          this.userType = userData.role || "user";
        } catch (e) {
          this.userType = 'user'; // Fallback em caso de erro
        }
      } else {
        this.userType = 'guest'; 
      }
    },
  },
  created() {
    // Adiciona listeners para manter o header sincronizado
    window.addEventListener("storage", this.atualizarEstado);
    window.addEventListener("login-update", this.atualizarEstado);
  },
  beforeUnmount() {
    // Remove os listeners ao destruir o componente
    window.removeEventListener("storage", this.atualizarEstado);
    window.removeEventListener("login-update", this.atualizarEstado);
  },
  watch: {
    // Atualiza o header a cada mudança de rota
    $route() {
      this.atualizarEstado();
      this.menuOpen = false; // Fecha o menu mobile ao navegar
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');

h1 {
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Estilo unificado para os links de navegação */
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  background-color: #4e44e1;
  color: white;
}

.nav-link:hover {
  background-color: #04d1b0;
  transform: scale(1.05);
}
</style>