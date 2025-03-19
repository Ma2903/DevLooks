<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
        <div class="text-center mb-10">
          <img src="../assets/logo_teste.jpg" alt="Logo" class="w-28 h-28 mx-auto rounded-full shadow-lg">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-6">Crie sua Conta</h1>
          <p class="text-gray-400 mt-3 text-lg">Preencha os campos abaixo para se cadastrar</p>
        </div>
        <form @submit.prevent="handleRegister">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="name"
                  v-model="name"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu email (ex: exemplo@email.com)"
                  required
                />
              </div>
            </div>
            <div>
              <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
              <div class="relative">
                <i class="fas fa-id-card absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="cpf"
                  v-model="cpf"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu CPF (somente números)"
                  required
                />
              </div>
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
              <div class="relative">
                <i class="fas fa-phone absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="phone"
                  v-model="phone"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu telefone com DDD (ex: 11999999999)"
                  required
                />
              </div>
            </div>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
              <div class="relative">
                <i class="fas fa-map-marker-alt absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="address"
                  v-model="address"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu endereço completo"
                  required
                />
              </div>
            </div>
            <div>
              <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
              <div class="relative">
                <i class="fas fa-map-pin absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="cep"
                  v-model="cep"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu CEP (ex: 12345678)"
                  required
                />
              </div>
            </div>
            <div>
              <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
              <div class="relative">
                <i class="fas fa-city absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="city"
                  v-model="city"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite sua cidade"
                  required
                />
              </div>
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <div class="relative">
                <i class="fas fa-flag absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="state"
                  v-model="state"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu estado"
                  required
                />
              </div>
            </div>
            <div>
              <label for="country" class="block text-sm font-medium text-gray-300 mb-2">País</label>
              <div class="relative">
                <i class="fas fa-globe absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="country"
                  v-model="country"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu país"
                  required
                />
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <div class="relative">
                <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  class="w-full pl-10 pr-12 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite uma senha forte"
                  required
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute right-3 top-3 text-gray-400 hover:text-gray-200 focus:outline-none"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg mt-8"
          >
            <i class="fas fa-user-plus mr-2"></i> Cadastrar
          </button>
        </form>
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-lg">
            Já tem uma conta? 
            <router-link to="/login" class="text-purple-400 hover:underline">Voltar para o Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Register",
    data() {
      return {
        name: "",
        email: "",
        cpf: "",
        phone: "",
        address: "",
        cep: "",
        city: "",
        state: "",
        country: "",
        password: "",
        showPassword: false,
      };
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      handleRegister() {
        console.log("Dados do usuário:", {
          name: this.name,
          email: this.email,
          cpf: this.cpf,
          phone: this.phone,
          address: this.address,
          cep: this.cep,
          city: this.city,
          state: this.state,
          country: this.country,
          password: this.password,
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
    color: #9CA3AF; /* Cor do placeholder */
  }
  </style>