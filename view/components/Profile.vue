<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
    <div class="bg-gray-900 p-16 rounded-3xl shadow-2xl w-full max-w-4xl">
      <div class="text-center mb-10">
        <img src="https://via.placeholder.com/150" alt="Avatar" class="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-purple-500">
        <h1 class="text-5xl font-extrabold text-purple-400 mt-6 flex items-center justify-center">
          <i class="fas fa-user-circle mr-3"></i> {{ userData.name }}
        </h1>
        <p class="text-gray-400 mt-3 text-lg flex items-center justify-center">
          <i class="fas fa-envelope mr-2"></i> {{ userData.email }}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-bold text-purple-400 mb-4 flex items-center">
            <i class="fas fa-id-card mr-2"></i> Informações Pessoais
          </h2>
          <p class="text-gray-300 mb-2"><i class="fas fa-id-badge mr-2"></i> CPF: {{ userData.cpf }}</p>
          <p class="text-gray-300 mb-2"><i class="fas fa-phone mr-2"></i> Telefone: {{ userData.telephone }}</p>
          <p class="text-gray-300"><i class="fas fa-map-marker-alt mr-2"></i> Endereço: {{ userData.address }}</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-bold text-purple-400 mb-4 flex items-center">
            <i class="fas fa-map mr-2"></i> Localização
          </h2>
          <p class="text-gray-300 mb-2"><i class="fas fa-map-pin mr-2"></i> CEP: {{ userData.cep }}</p>
          <p class="text-gray-300 mb-2"><i class="fas fa-city mr-2"></i> Cidade: {{ userData.city }}</p>
          <p class="text-gray-300"><i class="fas fa-flag mr-2"></i> Estado: {{ userData.state }}</p>
        </div>
      </div>
      <div class="flex justify-center space-x-4 mt-10">
        <router-link
          to="/edit-user"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <i class="fas fa-edit mr-2"></i> Editar Dados
        </router-link>
        <router-link
          to="/create-avatar"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <i class="fas fa-user-edit mr-2"></i> Editar Avatar
        </router-link>
        <button
          @click="showDeleteModal = true"
          class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <i class="fas fa-trash-alt mr-2"></i> Deletar Conta
        </button>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold text-red-500 mb-4 text-center">Confirmação de Exclusão</h2>
        <p class="text-gray-300 mb-4 text-center">
          Para deletar sua conta, digite <span class="text-red-500 font-bold">"DELETAR"</span> no campo abaixo.
        </p>
        <input
          type="text"
          v-model="deleteConfirmation"
          class="w-full px-4 py-3 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Digite 'DELETAR' para confirmar"
        />
        <div class="flex justify-between mt-6">
          <button
            @click="showDeleteModal = false"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancelar
          </button>
          <button
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'DELETAR'"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userData : {},
      showDeleteModal: false,
      deleteConfirmation: "",
    };
  },

  async mounted() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token não encontrado, redirecionando para o login");
      // redireciona para o login
      this.$router.push("/login");
      return;
    }

    try {
      const res = await axios.post("/api/users/me", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.userData = res.data;

    } catch (err) {
      console.error("Erro ao validar o token:", err.response?.data || err.message);
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  },

  methods: {
    deleteAccount() {
      if (this.deleteConfirmation === "DELETAR") {
        console.log("Conta deletada");
        this.showDeleteModal = false;
        this.deleteConfirmation = "";
      }
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