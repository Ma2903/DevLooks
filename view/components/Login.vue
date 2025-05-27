<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="m-10 bg-gray-900 p-20 rounded-3xl shadow-2xl w-full max-w-2xl">
        <div class="text-center mb-10">
          <img src="../assets/logo_teste.jpg" alt="Logo" class="w-28 h-28 mx-auto rounded-full shadow-lg">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-6">Bem-vindo de Volta!</h1>
          <p class="text-gray-400 mt-3 text-lg">Faça login para continuar</p>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-8">
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative flex">
              <i class="fas fa-envelope absolute left-3 mt-5 text-gray-400"></i>
              <input
                ref="emailInput"
                type="email"
                id="email"
                v-model="email"
                aria-label="Email"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>
          <div class="mb-8">
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 mt-5 text-gray-400"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                aria-label="Senha"
                class="w-full pl-10 pr-12 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-200 focus:outline-none"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <i :class="showPassword ? 'fas fa-eye-slash mt-2' : 'fas fa-eye mt-2' "></i>
              </button>
            </div>
          </div>
          <div v-if="loginError" class="mb-6 flex items-center gap-2 text-red-400 bg-red-900/40 px-4 py-3 rounded-lg animate-pulse">
            <i class="fas fa-exclamation-triangle"></i>
            {{ loginError }}
          </div>
          <div class="mb-8 text-right">
          <router-link to="/reset-password" class="text-sm text-purple-400 hover:underline">
            Esqueceu sua senha?
          </router-link>
        </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin mr-2"><i class="fas fa-spinner"></i></span>
            <i class="fas fa-sign-in-alt mr-2"></i> Entrar
          </button>
        </form>
        <div class="mt-8 text-center">
            <p class="text-gray-400 text-lg">
                Não tem uma conta? 
                <router-link to="/register" class="text-purple-400 hover:underline">Cadastre-se</router-link>
            </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import Swal from "sweetalert2";
  export default {
    name: "Login",
    data() {
      return {
        email: "",
        password: "",
        showPassword: false,
        loading: false,
        loginError: "",
      };
    },
    mounted() {
      this.$refs.emailInput.focus();
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      async handleLogin() {
        this.loading = true;
        this.loginError = "";
        try {
          const response = await axios.post("/api/users/login", {
            email: this.email,
            password: this.password,
          });
          console.log("Resposta do login:", response.data);
          // Após login bem-sucedido
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          window.dispatchEvent(new Event("storage"));
          Swal.fire({
            icon: 'success',
            title: 'Login realizado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
            background: "#1F2937",
            color: "#E5E7EB",
          });
          setTimeout(() => {
            window.location.href = "/profile"; // ou "/" se preferir ir para a home
          }, 1500);
        } catch (error) {
          this.loginError = "Verifique suas credenciais.";
          console.error("Erro ao fazer login:", error.response?.data || error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao fazer login',
            text: 'Verifique suas credenciais.',
            background: "#1F2937",
            color: "#E5E7EB",
          });
        }
        this.loading = false;
      }
    },
  };
  </script>
  
  <style scoped>
  @import '@fortawesome/fontawesome-free/css/all.css';
  
  body {
    font-family: 'Fira Code', monospace;
  }
  
  button:hover {
    transform: scale(1.05);
  }
  
  input::placeholder {
    color: #9CA3AF; /* Cor do placeholder */
  }
  </style>