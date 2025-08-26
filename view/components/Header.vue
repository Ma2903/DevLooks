<template>
  <header class="bg-[#04d1b0] text-white p-4 md:p-6 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto flex flex-wrap justify-between items-center">
      <div class="flex items-center space-x-4">
        <img
          src="../assets/favicon.png"
          alt="Nova Logo do Sistema"
          class="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg"
        />
        <div>
          <h1 class="text-3xl font-poppins font-bold tracking-wide">
            <span class="text-[#04d1b0]">Dev</span><span class="text-[#4e44e1]">Looks</span>
          </h1>
        </div>
      </div>

      <nav
        :class="{'hidden': !menuOpen, 'block': menuOpen}"
        class="w-full md:w-auto md:flex md:items-center md:space-x-6 text-lg md:text-xl mt-4 md:mt-0 text-[#4e44e1]"
      >
        <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <li>
            <router-link to="/home" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-home"></i><span>Home</span></router-link>
          </li>
          <li>
            <router-link to="/products" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-store"></i><span>Produtos</span></router-link>
          </li>
          <li v-if="userType === 'user'">
            <router-link to="/cart" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-shopping-cart"></i><span>Carrinho</span></router-link>
          </li>

          <template v-if="isLoggedIn">
            <li v-if="userType === 'user'">
              <router-link to="/create-avatar" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-user-astronaut"></i><span>Criar Avatar</span></router-link>
            </li>
            
            <li v-if="userType === 'admin' || userType === 'owner'">
              <router-link to="/admin/products" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-cogs"></i><span>Gerir Produtos</span></router-link>
            </li>
            <li v-if="userType === 'admin' || userType === 'owner'">
              <router-link to="/admin/coupons" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-tags"></i><span>Gerir Cupons</span></router-link>
            </li>

            <li v-if="userType === 'owner'">
              <router-link to="/admin/users" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-users"></i><span>Gerir Utilizadores</span></router-link>
            </li>
            
            <li>
              <router-link to="/profile" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-user"></i><span>Perfil</span></router-link>
            </li>
          </template>

          <li v-if="!isLoggedIn">
            <router-link to="/login" class="px-4 py-2 bg-[#4e44e1] text-white rounded hover:bg-[#04d1b0] flex items-center space-x-2 transition" style="color: white !important;"><i class="fas fa-sign-in-alt"></i><span>Entrar</span></router-link>
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
      const userDataRaw = localStorage.getItem("userData");
      this.isLoggedIn = !!localStorage.getItem("token");

      if (this.isLoggedIn && userDataRaw && userDataRaw !== "undefined") {
        const userData = JSON.parse(userDataRaw);
        this.userType = userData.role || "user";
      } else {
        this.userType = 'guest'; 
      }
    },
  },
  created() {
    this.atualizarUserType();
    window.addEventListener("storage", this.atualizarUserType);
    window.addEventListener("login-update", this.atualizarUserType);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.atualizarUserType);
    window.removeEventListener("login-update", this.atualizarUserType);
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

/* O seu CSS permanece igual */
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
  transform: scale(1.07);
}
button:hover {
  transform: scale(1.1);
}
</style>