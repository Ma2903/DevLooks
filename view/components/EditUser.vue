<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 md:p-20 rounded-3xl shadow-2xl w-full max-w-4xl">
      <div class="text-center mb-10">
        <i class="fas fa-user-edit text-6xl text-[#04d1b0] mb-4"></i>
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-2 flex items-center justify-center gap-3">
          Editar Dados
        </h1>
        <p class="text-gray-400 mt-3 text-lg">Atualize suas informações abaixo</p>
      </div>
      <form @submit.prevent="handleEdit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="name"
                v-model="userData.name"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu nome completo"
                required
              />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative">
              <i class="fas fa-envelope absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="email"
                id="email"
                v-model="userData.email"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
            <div class="relative">
              <i class="fas fa-id-card absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="cpf"
                v-model="userData.cpf"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu CPF"
                required
              />
            </div>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <div class="relative">
              <i class="fas fa-phone absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="phone"
                v-model="userData.telephone"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu telefone"
                required
              />
            </div>
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
            <div class="relative">
              <i class="fas fa-map-marker-alt absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="address"
                v-model="userData.address"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu endereço"
                required
              />
            </div>
          </div>
          <div>
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <div class="relative">
              <i class="fas fa-map-pin absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="cep"
                v-model="userData.cep"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu CEP"
                required
              />
            </div>
          </div>
          <div>
            <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
            <div class="relative">
              <i class="fas fa-city absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="city"
                v-model="userData.city"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite sua cidade"
                required
              />
            </div>
          </div>
          <div>
            <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <div class="relative">
              <i class="fas fa-flag absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="state"
                v-model="userData.state"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu estado"
                required
              />
            </div>
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-300 mb-2">País</label>
            <div class="relative">
              <i class="fas fa-globe absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="text"
                id="country"
                v-model="userData.country"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite seu país"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg mt-8 flex items-center justify-center gap-2"
        >
          <i class="fas fa-save mr-2"></i> Salvar Alterações
        </button>
      </form>
      <div class="mt-8 text-center">
        <router-link to="/profile" class="text-[#04d1b0] hover:underline text-lg flex items-center justify-center gap-2">
          <i class="fas fa-arrow-left"></i> Voltar ao Perfil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
  name: "EditUser",
  data() {
    return {
      userData: {
        name: "",
        email: "",
        cpf: "",
        telephone: "",
        address: "",
        cep: "",
        city: "",
        state: "",
        country: "",
      },
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

    } catch (err) {
      console.error("Erro ao validar o token:", err.response?.data || err.message);
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  },
  methods: {
    async handleEdit() {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/users/${this.userData._id}`, this.userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        Swal.fire({
          title: "Usuário Editado com Sucesso!",
          icon: "success",
          background: "#1F2937",
          color: "#E5E7EB",
        });
        this.$router.push("/profile");
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível editar o usuário.',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
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