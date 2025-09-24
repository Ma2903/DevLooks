<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="bg-gray-900 p-16 rounded-3xl shadow-2xl w-full max-w-4xl">
      <div class="text-center mb-10 relative">
        <div class="relative inline-block">
          <img
            :src="userData.avatarUrl || defaultAvatar"
            alt="Avatar do Usuário"
            class="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-[#04d1b0] bg-gray-700 object-cover"
          />
          <router-link
            to="/create-avatar"
            class="absolute bottom-0 right-0 bg-[#04d1b0] hover:bg-[#4e44e1] text-white font-bold p-2 rounded-full shadow-lg transition"
            title="Editar Avatar"
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gradient-to-r from-[#04d1b0]/20 to-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-[#04d1b0] mb-4">
          <h2 class="text-xl font-bold text-[#04d1b0] mb-4 flex items-center">
            <i class="fas fa-id-card mr-2"></i> Informações Pessoais
          </h2>
          <p class="text-gray-300 mb-2"><i class="fas fa-id-badge mr-2"></i> CPF: {{ userData.cpf }}</p>
          <p class="text-gray-300"><i class="fas fa-phone mr-2"></i> Telefone: {{ userData.telephone }}</p>
        </div>
        
        <div class="bg-gradient-to-r from-[#04d1b0]/20 to-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-[#04d1b0] mb-4">
          <h2 class="text-xl font-bold text-[#04d1b0] mb-4 flex items-center">
            <i class="fas fa-map-marker-alt mr-2"></i> Endereço
          </h2>
          <p class="text-gray-300 mb-2"><i class="fas fa-road mr-2"></i> {{ userData.address }}, {{ userData.number }}</p>
          <p v-if="userData.complement" class="text-gray-300 mb-2"><i class="fas fa-info-circle mr-2"></i> Complemento: {{ userData.complement }}</p>
          <p class="text-gray-300 mb-2"><i class="fas fa-map-marked-alt mr-2"></i> Bairro: {{ userData.bairro }}</p>
          <p class="text-gray-300 mb-2"><i class="fas fa-map-pin mr-2"></i> CEP: {{ userData.cep }}</p>
          <p class="text-gray-300"><i class="fas fa-city mr-2"></i> {{ userData.city }} - {{ userData.state }}</p>
        </div>
      </div>
      <div class="flex justify-center space-x-4 mt-10">
        <router-link
          to="/edit-user"
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          <i class="fas fa-edit mr-2"></i> Editar Dados
        </router-link>
        <router-link
          to="/order-history"
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          <i class="fas fa-history mr-2"></i> Histórico de Compras
        </router-link>
        <button
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          <i class="fas fa-trash-alt mr-2"></i> Deletar Conta
        </button>
        <button
          @click="confirmLogout"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          <i class="fas fa-sign-out-alt mr-2"></i> Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import defaultAvatar from '@/assets/Logo.png'; // Importa a imagem padrão

export default {
  data() {
    return {
      userData: {},
      token: localStorage.getItem("token"),
      defaultAvatar: defaultAvatar, // Adiciona a imagem padrão aos dados
    };
  },
async mounted() {
  if (!this.token) {
    this.$router.push("/login");
    return;
  }
  try {
    const res = await axios.get("/api/users/me", {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    
    this.userData = res.data;
    // Garante que a informação mais recente esteja no localStorage
    localStorage.setItem("userData", JSON.stringify(this.userData));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    // Se a chamada falhar (agora por outros motivos, como token expirado),
    // a lógica de logout continua correta.
    localStorage.removeItem("token");
    this.$router.push("/login");
  }
},
  methods: {
    confirmLogout() {
      Swal.fire({
        title: 'Você tem certeza?',
        text: "Você será desconectado da sua conta.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, sair!',
        cancelButtonText: 'Cancelar',
        background: "#1F2937",
        color: "#E5E7EB"
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        }
      })
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.dispatchEvent(new Event("storage"));
      this.$router.push("/login");
    },
    confirmDelete() {
      Swal.fire({
        title: 'Deletar sua conta?',
        text: "Esta ação é irreversível! Para confirmar, digite 'DELETAR' abaixo:",
        icon: 'error',
        input: 'text',
        inputPlaceholder: 'DELETAR',
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        background: "#1F2937",
        color: "#E5E7EB",
        preConfirm: (inputValue) => {
          if (inputValue !== 'DELETAR') {
            Swal.showValidationMessage('Você precisa digitar "DELETAR" para confirmar.');
            return false;
          }
          return inputValue;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteAccount();
        }
      });
    },
    // Dentro do objeto 'methods' do seu componente

async deleteAccount() {
  // --- ADICIONE ESTA VERIFICAÇÃO ---
  // Se userData ou seu _id não existirem, exibe um erro e desloga o usuário.
  if (!this.userData || !this.userData._id) {
    Swal.fire({
        title: 'Erro de Sessão',
        text: 'Não foi possível encontrar os dados do seu usuário. Por favor, faça o login novamente.',
        icon: 'warning',
        background: "#1F2937",
        color: "#E5E7EB"
    });
    this.logout(); // Redireciona para a página de login
    return; // Para a execução da função aqui
  }
  // --- FIM DA VERIFICAÇÃO ---

  try {
    // O restante do código permanece o mesmo
    await axios.delete(`/api/users/${this.userData._id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    Swal.fire({
        title: 'Conta Deletada!',
        text: 'Sua conta foi removida com sucesso.',
        icon: 'success',
        background: "#1F2937",
        color: "#E5E7EB"
    });
    this.logout();
  } catch (err) {
    Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível deletar a sua conta.',
        icon: 'error',
        background: "#1F2937",
        color: "#E5E7EB"
    });
  }
},
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>