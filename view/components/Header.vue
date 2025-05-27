<template>
  <header class="bg-gray-900 text-white p-4 md:p-6 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto flex flex-wrap justify-between items-center">
      <!-- Logo e Título -->
      <div class="flex items-center space-x-4">
        <img
          src="../assets/logo_teste.jpg"
          alt="Logo da Loja Geek"
          class="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg"
        />
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-purple-400 tracking-wide font-poppins">
            Loja Geek
          </h1>
        </div>
      </div>

      <!-- Navegação -->
      <nav
        :class="{'hidden': !menuOpen, 'block': menuOpen}"
        class="w-full md:w-auto md:flex md:items-center md:space-x-6 text-lg md:text-xl mt-4 md:mt-0"
      >
        <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <!-- Botão Home (sempre visível) -->
          <li>
            <router-link
              to="/home"
              class="hover:text-purple-400 flex items-center space-x-2 transition"
            >
              <i class="fas fa-home"></i><span>Home</span>
            </router-link>
          </li>

          <!-- Botão Produtos (sempre visível) -->
          <li>
            <router-link
              to="/products"
              class="hover:text-purple-400 flex items-center space-x-2 transition"
            >
              <i class="fas fa-store"></i><span>Produtos</span>
            </router-link>
          </li>

          <!-- Os demais só aparecem se estiver logado -->
          <template v-if="isLoggedIn">
            <!-- Botão Criar Avatar (todos logados) -->
            <li>
              <router-link
                to="/create-avatar"
                class="hover:text-purple-400 flex items-center space-x-2 transition"
              >
                <i class="fas fa-user-astronaut"></i><span>Criar Avatar</span>
              </router-link>
            </li>

            <!-- Botão Gerenciar Produtos (apenas admin) -->
            <li v-if="userType === 'admin'">
              <router-link
                to="/admin/products"
                class="hover:text-purple-400 flex items-center space-x-2 transition"
              >
                <i class="fas fa-cogs"></i><span>Gerenciar Produtos</span>
              </router-link>
            </li>

            <!-- Botão Carrinho (apenas user normal) -->
            <li v-if="userType !== 'admin'">
              <router-link
                to="/cart"
                class="hover:text-purple-400 flex items-center space-x-2 transition"
              >
                <i class="fas fa-shopping-cart"></i>
                <span>Carrinho</span>
              </router-link>
            </li>

            <!-- Botão Perfil -->
            <li>
              <router-link
                to="/profile"
                class="hover:text-purple-400 flex items-center space-x-2 transition"
              >
                <i class="fas fa-user"></i><span>Perfil</span>
              </router-link>
            </li>
          </template>

          <!-- Botão Entrar (aparece só se não estiver logado) -->
          <li v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="hover:text-purple-400 flex items-center space-x-2 transition"
            >
              <i class="fas fa-sign-in-alt"></i><span>Entrar</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Menu Toggle Button -->
      <button @click="toggleMenu" class="md:hidden text-2xl focus:outline-none transition">
        <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      menuOpen: false,
      isLoggedIn: !!localStorage.getItem("token"),
      userType: "user",
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    atualizarUserType() {
      let userDataRaw = localStorage.getItem("userData");
      let userData = {};
      if (userDataRaw && userDataRaw !== "undefined") {
        userData = JSON.parse(userDataRaw);
      }
      this.userType = userData.role || (userData.user && userData.user.role) || "user";
      this.isLoggedIn = !!localStorage.getItem("token");
    },
  },
  created() {
    this.atualizarUserType();
    window.addEventListener("storage", this.atualizarUserType);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.atualizarUserType);
  },
  watch: {
    $route() {
      this.atualizarUserType();
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');

header {
  background-color: #1a202c;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
}

a {
  transition: color 0.3s, transform 0.2s;
}

a:hover {
  color: #a78bfa;
  transform: scale(1.07);
}

button:hover {
  transform: scale(1.1);
  color: #a78bfa;
}
</style>