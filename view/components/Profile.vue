<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="bg-gray-900 p-16 rounded-3xl shadow-2xl w-full max-w-4xl">
      <div class="text-center mb-10 relative">
        <!-- Avatar com ícone de edição -->
        <div class="relative inline-block">
          <img
            src="./"
            class="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-[#04d1b0]"
          />
          <router-link
            to="/create-avatar"
            class="absolute bottom-0 right-0 bg-[#04d1b0] hover:bg-[#4e44e1] text-white font-bold p-2 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <i class="fas fa-edit"></i>
          </router-link>
        </div>
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-6 flex items-center justify-center">
          <i class="fas fa-user-circle text-6xl mr-3 text-[#04d1b0]"></i> {{ userData.name }}
        </h1>
        <p class="text-gray-400 mt-3 text-lg flex items-center justify-center">
          <i class="fas fa-envelope mr-2"></i> {{ userData.email }}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-r from-[#04d1b0]/20 to-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-[#04d1b0] mb-4">
          <h2 class="text-xl font-bold text-[#04d1b0] mb-4 flex items-center">
            <i class="fas fa-id-card mr-2"></i> Informações Pessoais
          </h2>
          <p class="text-gray-300 mb-2"><i class="fas fa-id-badge mr-2"></i> CPF: {{ userData.cpf }}</p>
          <p class="text-gray-300 mb-2"><i class="fas fa-phone mr-2"></i> Telefone: {{ userData.telephone }}</p>
          <p class="text-gray-300"><i class="fas fa-map-marker-alt mr-2"></i> Endereço: {{ userData.address }}</p>
        </div>
        <div class="bg-gradient-to-r from-[#04d1b0]/20 to-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-[#04d1b0] mb-4">
          <h2 class="text-xl font-bold text-[#04d1b0] mb-4 flex items-center">
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
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <i class="fas fa-edit mr-2"></i> Editar Dados
        </router-link>
        <button
          @click="showDeleteModal = true"
          class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <i class="fas fa-trash-alt mr-2"></i> Deletar Conta
        </button>
        <button
          @click="showLogoutModal = true"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <i class="fas fa-sign-out-alt mr-2"></i> Sair
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

    <!-- Modal de Confirmação de Logout -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold text-[#04d1b0] mb-4 text-center">Confirmação de Logout</h2>
        <p class="text-gray-300 mb-4 text-center">
          Tem certeza que deseja sair do sistema?
        </p>
        <div class="flex justify-between mt-6">
          <button
            @click="showLogoutModal = false"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancelar
          </button>
          <button
            @click="logout"
            class="bg-[#04d1b0] hover:bg-[#4e44e1] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
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
import Swal from "sweetalert2";

export default {
  data() {
    return {
      userData: {},
      showDeleteModal: false,
      showLogoutModal: false, // Estado para o modal de logout
      deleteConfirmation: "",
      token: localStorage.getItem("token"),
    };
  },

  async mounted() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token não encontrado, redirecionando para o login");
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
      localStorage.setItem("userData", JSON.stringify(this.userData));
      window.dispatchEvent(new Event("storage"));

    } catch (err) {
      console.error("Erro ao validar o token:", err.response?.data || err.message);
      localStorage.removeItem("token");
      this.$router.push("/login");
    }

    this.checkNivel();
  },

  methods: {
    async deleteAccount() {
      if (this.deleteConfirmation === "DELETAR") {
        try {
          const res = await axios.delete(`/api/users/${this.userData._id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Conta deletada",
              text: "Sua conta foi deletada com sucesso.",
            });
            localStorage.removeItem("token");
            this.$router.push("/login");
          }
        } catch (error) {
          console.error("Erro ao deletar a conta:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Não foi possível deletar a conta. Tente novamente mais tarde.",
          });
        }
        this.showDeleteModal = false;
        this.deleteConfirmation = "";
      }
    },
    logout() {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage")); // Dispara o evento de mudança no localStorage
      this.$router.push("/login");
    },
    async checkNivel() {
      try {
        const res = await axios.get(`/api/users/${this.userData._id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (res.data && res.data.role) {
          this.userData.role = res.data.role;
          console.log("Nível do usuário:", this.userData.role);
        } else {
          console.warn("Nível do usuário não encontrado, definindo como 'user'");
          this.userData.role = "user";
        }
      } catch (error) {
        console.error("Erro ao verificar o nível do usuário:", error);
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