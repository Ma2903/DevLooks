<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="bg-gray-900 p-24 rounded-3xl shadow-2xl w-full max-w-3xl">
        <div class="text-center mb-12">
          <img src="../assets/logo_teste.jpg" alt="Logo" class="w-32 h-32 mx-auto rounded-full shadow-lg">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-8">Redefinir Senha</h1>
          <p class="text-gray-400 mt-4 text-xl">Digite seu email para redefinir sua senha</p>
        </div>
        <form @submit.prevent="handleResetPassword">
          <div class="mb-8">
            <label for="email" class="block text-lg font-medium text-gray-300 mb-3">Email</label>
            <div class="relative">
              <i class="fas fa-envelope email-icon"></i>
              <input
                type="email"
                id="email"
                v-model="email"
                class="w-full pl-14 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-5 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin mr-2"><i class="fas fa-spinner"></i></span>
            <i class="fas fa-paper-plane mr-3"></i> Enviar Link de Redefinição
          </button>
        </form>
        <div v-if="resetSuccess" class="mt-4 flex items-center gap-2 text-green-400 bg-green-900/40 px-4 py-3 rounded-lg animate-pulse">
          <i class="fas fa-check-circle"></i>
          {{ resetSuccess }}
        </div>
        <div v-if="resetError" class="mt-4 flex items-center gap-2 text-red-400 bg-red-900/40 px-4 py-3 rounded-lg animate-pulse">
          <i class="fas fa-exclamation-triangle"></i>
          {{ resetError }}
        </div>
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-lg">
            Lembrou sua senha? 
            <router-link to="/login" class="text-purple-400 hover:underline">Faça login</router-link>
            </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ResetPassword",
    data() {
      return {
        email: "",
        loading: false,
        resetSuccess: "",
        resetError: "",
      };
    },
    methods: {
      async handleResetPassword() {
        this.loading = true;
        this.resetSuccess = "";
        this.resetError = "";
        try {
          // ...envio do email...
          this.resetSuccess = "Um link de redefinição de senha foi enviado para o seu email.";
          setTimeout(() => {
            this.$router.push("/confirm-reset");
          }, 2000); // Aguarda 2 segundos para mostrar o feedback antes de redirecionar
        } catch (error) {
          this.resetError = "Erro ao enviar o link. Tente novamente.";
        }
        this.loading = false;
      },
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
  
  img {
    width: 8rem; /* Aumenta o tamanho da logo */
    height: 8rem;
  }
  
  h1 {
    font-size: 3rem; /* Aumenta o tamanho do título */
  }
  
  p {
    font-size: 1.25rem; /* Aumenta o tamanho do texto */
  }
  
  input {
    font-size: 1.125rem; /* Aumenta o tamanho do texto nos inputs */
    padding: 1.25rem; /* Aumenta o padding dos inputs */
    padding-left: 3rem; /* Ajusta o padding do input de email */
  }
  
  button {
    font-size: 1.25rem; /* Aumenta o tamanho do texto no botão */
    padding: 1.25rem 2rem; /* Aumenta o padding do botão */
  }
  
  /* Estilo específico para o ícone do input de email */
  .email-icon {
    position: absolute;
    left: 0.75rem; /* Ajusta a posição horizontal do ícone */
    top: 50%; /* Centraliza verticalmente */
    transform: translateY(-50%); /* Corrige o alinhamento vertical */
    color: #9CA3AF; /* Cor do ícone */
    font-size: 1.25rem; /* Tamanho do ícone */
  }
  </style>