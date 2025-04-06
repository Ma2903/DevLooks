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
                type="email"
                id="email"
                v-model="email"
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
                class="w-full pl-10 pr-12 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                <i :class="showPassword ? 'fas fa-eye-slash mt-2' : 'fas fa-eye mt-2' "></i>
              </button>
            </div>
          </div>
          <div class="mb-8 text-right">
          <router-link to="/reset-password" class="text-sm text-purple-400 hover:underline">
            Esqueceu sua senha?
          </router-link>
        </div>
          <button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
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
  export default {
    name: "Login",
    data() {
      return {
        email: "",
        password: "",
        showPassword: false,
      };
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      async handleLogin() {
        try {
          // Envia a requisição de login para o backend
          const response = await axios.post("/api/users/login", {
            email: this.email,
            password: this.password,
          });

          // Sucesso no login
          console.log("Login bem-sucedido:", response.data);
          // Armazena o token no localStorage
          localStorage.setItem("token", response.data.token);
          this.$router.push("/home");
        } catch (error) {
          // Trata erros de autenticação
          console.error("Erro no login:", error.response?.data || error.message);
          this.errorMessage =
            error.response?.data?.message || "Erro ao realizar login.";
        }
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