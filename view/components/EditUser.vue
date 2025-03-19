<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="m-10 bg-gray-900 p-20 rounded-3xl shadow-2xl w-full max-w-6xl">
        <div class="text-center mb-10">
          <img src="../assets/logo_teste.jpg" alt="Logo" class="w-28 h-28 mx-auto rounded-full shadow-lg">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-6">Editar Dados</h1>
          <p class="text-gray-400 mt-3 text-lg">Atualize suas informações abaixo</p>
        </div>
        <form @submit.prevent="handleEdit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="name"
                  v-model="user.name"
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
                  v-model="user.email"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu email"
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
                  v-model="user.cpf"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu CPF"
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
                  v-model="user.phone"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu telefone"
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
                  v-model="user.address"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu endereço"
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
                  v-model="user.cep"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu CEP"
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
                  v-model="user.city"
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
                  v-model="user.state"
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
                  v-model="user.country"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite seu país"
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg mt-8"
          >
            <i class="fas fa-save mr-2"></i> Salvar Alterações
          </button>
        </form>
        <div class="mt-8 text-center">
          <router-link to="/profile" class="text-purple-400 hover:underline text-lg">
            <i class="fas fa-arrow-left mr-2"></i> Voltar ao Perfil
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditUser",
    data() {
      return {
        user: {
          name: "",
          email: "",
          cpf: "",
          phone: "",
          address: "",
          cep: "",
          city: "",
          state: "",
          country: "",
        },
      };
    },
    methods: {
      handleEdit() {
        // Lógica para salvar as alterações do usuário
        console.log("Dados atualizados do usuário:", this.user);
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