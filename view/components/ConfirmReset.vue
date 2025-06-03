<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="bg-gray-900 p-12 rounded-3xl shadow-2xl w-full max-w-xl">
      <div class="text-center mb-8">
        <i class="fas fa-key text-5xl text-[#04d1b0] mb-4"></i>
        <h1 class="text-3xl font-extrabold text-[#04d1b0] mb-2">Redefinir Senha</h1>
        <p class="text-gray-400">Digite o código recebido no seu email e crie uma nova senha.</p>
      </div>
      <form @submit.prevent="handleConfirmReset">
        <div class="mb-6">
          <label for="code" class="block text-sm font-medium text-gray-300 mb-2">Código</label>
          <div class="relative">
            <i class="fas fa-shield-alt absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              id="code"
              v-model="code"
              class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]"
              placeholder="Digite o código recebido"
              required
            />
          </div>
        </div>
        <div class="mb-6">
          <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="newPassword"
              v-model="newPassword"
              class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]"
              placeholder="Digite a nova senha"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-3 text-gray-400 hover:text-gray-200 focus:outline-none"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="mb-8">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirmar Nova Senha</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]"
              placeholder="Confirme a nova senha"
              required
            />
          </div>
        </div>
        <div v-if="resetError" class="mb-4 flex items-center gap-2 text-red-400 bg-red-900/40 px-4 py-3 rounded-lg animate-pulse">
          <i class="fas fa-exclamation-triangle"></i>
          {{ resetError }}
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="animate-spin mr-2"><i class="fas fa-spinner"></i></span>
          <i class="fas fa-check mr-2"></i> Concluir
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "ConfirmReset",
  data() {
    return {
      code: "",
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      loading: false,
      resetError: "",
    };
  },
  methods: {
    handleConfirmReset() {
      this.resetError = "";
      if (this.newPassword !== this.confirmPassword) {
        this.resetError = "As senhas não coincidem.";
        return;
      }
      this.loading = true;

      const urlParams = new URLSearchParams(window.location.search);
      const hash = urlParams.get("hash");
      const email = urlParams.get("email");

      axios.post("/api/users/reset-password", {
        code: this.code,
        newPassword: this.newPassword,
        hash,
        email,
      })
        .then((response) => {
          this.loading = false;
          if (response.data.success) {
            Swal.fire({
              icon: "success",
              title: "Senha redefinida com sucesso!",
              background: "#1F2937",
              color: "#E5E7EB",
            }).then(() => {
              this.$router.push("/login");
          });
          } else {
            this.resetError = response.data.message || "Erro ao redefinir a senha.";
          }
        })
        .catch((error) => {
          this.loading = false;
          this.resetError = error.response?.data?.message || "Erro ao redefinir a senha.";
        });
      
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
</style>