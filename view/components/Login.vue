<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200 px-4 py-8">
      <div class="bg-gray-900 p-6 sm:p-10 md:p-16 lg:p-20 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl">
        <div class="text-center mb-6 sm:mb-8 md:mb-10">
          <img src="../assets/Logo.png" alt="DevLooks Logo" class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto rounded-full shadow-lg">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#04d1b0] mt-4 sm:mt-5 md:mt-6">Bem-vindo de Volta!</h1>
          <p class="text-gray-400 mt-2 sm:mt-3 text-base sm:text-lg">Faça login para continuar</p>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-4 sm:mb-6 md:mb-8">
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative">
              <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                ref="emailInput"
                type="email"
                id="email"
                v-model="email"
                @blur="validateEmail"
                aria-label="Digite seu email"
                autocomplete="email"
                :class="['w-full pl-10 pr-4 py-3 sm:py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base', emailError ? 'ring-2 ring-red-500' : 'focus:ring-[#04d1b0]']"
                placeholder="seu@email.com"
                required
              />
            </div>
            <span v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</span>
          </div>
          <div class="mb-4 sm:mb-6 md:mb-8">
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                aria-label="Digite sua senha"
                autocomplete="current-password"
                class="w-full pl-10 pr-12 py-3 sm:py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] text-sm sm:text-base"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none p-1"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <div v-if="loginError" class="mb-6 flex items-center gap-2 text-red-400 bg-red-900/40 px-4 py-3 rounded-lg animate-pulse">
            <i class="fas fa-exclamation-triangle"></i>
            {{ loginError }}
          </div>
          <div class="mb-8 text-right">
          <router-link to="/reset-password" class="text-sm text-[#04d1b0] hover:underline">
            Esqueceu sua senha?
          </router-link>
        </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-base sm:text-lg flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span v-if="loading" class="animate-spin mr-2"><i class="fas fa-spinner"></i></span>
            <i v-if="!loading" class="fas fa-sign-in-alt"></i>
            <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
          </button>
        </form>
        <div class="mt-6 sm:mt-8 text-center">
            <p class="text-gray-400 text-sm sm:text-base md:text-lg">
                Não tem uma conta?
                <router-link to="/register" class="text-[#04d1b0] hover:underline font-semibold">Cadastre-se</router-link>
            </p>
        </div>
      </div>
    </div>
</template>

 <script>
    import api from "@/services/main.js";
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
          emailError: "",
        };
      },
      mounted() {
        this.$refs.emailInput.focus();
      },
      methods: {
        validateEmail() {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.email) {
            this.emailError = "O campo de e-mail é obrigatório.";
          } else if (!emailRegex.test(this.email)) {
            this.emailError = "Por favor, insira um formato de e-mail válido.";
          } else {
            this.emailError = "";
          }
        },
        togglePasswordVisibility() {
          this.showPassword = !this.showPassword;
        },
        async handleLogin() {
          this.validateEmail();
          if (this.emailError) {
            return;
          }

          this.loading = true;
          this.loginError = "";
          try {
            const response = await api.post("/api/users/login", {
              email: this.email,
              password: this.password,
            });

            console.log("Resposta do login:", response.data);
            
            localStorage.setItem("token", response.data.token);

            // --- CORREÇÃO CRÍTICA ---
            // Padronizamos a chave para 'userData', que é usado em toda a aplicação.
            localStorage.setItem("userData", JSON.stringify(response.data.user));
            
            console.log("Token salvo:", localStorage.getItem("token"));
            console.log("User salvo:", localStorage.getItem("userData"));
            
            // Avisa todo o app que o usuário mudou
            window.dispatchEvent(new Event("auth-change")); 

            await Swal.fire({
              icon: 'success',
              title: 'Login realizado com sucesso!',
              showConfirmButton: false,
              timer: 1500,
              background: "#1F2937",
              color: "#E5E7EB",
            });

            console.log("Redirecionando para /profile");
            // Agora o redirecionamento vai funcionar!
            this.$router.push("/profile");

          } catch (error) {
            console.error("Erro no login:", error);
            this.loginError = "Verifique suas credenciais.";
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
    font-display: swap;
  }

  button:hover {
    transform: scale(1.05);
  }

  input::placeholder {
    color: #9CA3AF;
  }
  </style>