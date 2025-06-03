<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="bg-gray-900 p-24 rounded-3xl shadow-2xl w-full max-w-3xl">
      <div class="text-center mb-12">
        <img src="../assets/Logo.png" alt="Logo" class="w-32 h-32 mx-auto rounded-full shadow-lg">
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-8">Redefinir Senha</h1>
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
              class="w-full pl-14 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]"
              placeholder="Digite seu email"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-5 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="animate-spin mr-2"><i class="fas fa-spinner"></i></span>
          <i class="fas fa-paper-plane mr-3"></i> Enviar Link de Redefinição
        </button>
      </form>
      <div v-if="resetSuccess" class="mt-4 flex items-center gap-2 text-[#04d1b0] bg-[#04d1b0]/10 px-4 py-3 rounded-lg animate-pulse">
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
          <router-link to="/login" class="text-[#04d1b0] hover:underline">Faça login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
      try{
        axios.post('/api/users/forgot-password', { email: this.email })
          .then(response => {
            this.$router.push("/confirm-reset?hash=" + response.data.code + "&email=" + response.data.email);
          });
      }catch (error) {
        this.resetError = "Erro ao enviar o link de redefinição. Verifique seu email.";
        console.error("Erro ao enviar o link de redefinição:", error);
      }
          // this.$router.push("/confirm-reset");ar
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
  color: #9CA3AF;
}
.email-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  font-size: 1.25rem;
}
</style>