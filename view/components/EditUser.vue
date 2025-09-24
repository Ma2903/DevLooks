<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 md:p-20 rounded-3xl shadow-2xl w-full max-w-6xl">
      <div class="text-center mb-10">
        <i class="fas fa-user-edit text-6xl text-[#04d1b0] mb-4"></i>
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-2">Editar Dados</h1>
        <p class="text-gray-400 mt-3 text-lg">Atualize suas informações abaixo</p>
      </div>
      <form @submit.prevent="handleEdit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="name" v-model="userData.name" class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" required />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative">
              <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="email" id="email" v-model="userData.email" class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" required />
            </div>
          </div>
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
            <div class="relative">
              <i class="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="cpf" v-model="userData.cpf" class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" required />
            </div>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <div class="relative">
              <i class="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="phone" v-model="userData.telephone" class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" required />
            </div>
          </div>

          <div>
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <div class="relative">
              <i class="fas fa-map-pin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="cep" v-model="userData.cep" @blur="fetchAddressFromCep" class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" required />
            </div>
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
            <input type="text" id="address" v-model="userData.address" class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg cursor-not-allowed" readonly />
          </div>
          <div class="grid grid-cols-2 gap-x-4">
              <div>
                <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
                <input type="text" id="number" v-model="userData.number" class="w-full pl-4 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" required />
              </div>
              <div>
                <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento</label>
                <input type="text" id="complement" v-model="userData.complement" class="w-full pl-4 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" />
              </div>
          </div>
          <div>
            <label for="bairro" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <input type="text" id="bairro" v-model="userData.bairro" class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg" readonly />
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
              <input type="text" id="city" v-model="userData.city" class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg" readonly />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <input type="text" id="state" v-model="userData.state" class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg" readonly />
            </div>
          </div>
        </div>
        <button type="submit" class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-6 rounded-lg shadow-lg mt-8">
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
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      // Inicializa userData como null para sabermos quando os dados estão carregando
      userData: null,
      token: null,
      loading: true, // Adiciona um estado de loading
    };
  },
  watch: {
    // Suas excelentes máscaras continuam aqui
    'userData.cpf'(newValue) {
        if (!newValue || !this.userData) return;
        this.userData.cpf = newValue
            .replace(/\D/g, '').slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    'userData.telephone'(newValue) {
        if (!newValue || !this.userData) return;
        const digits = newValue.replace(/\D/g, '').slice(0, 11);
        if (digits.length > 10) this.userData.telephone = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        else if (digits.length > 6) this.userData.telephone = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        else if (digits.length > 2) this.userData.telephone = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        else this.userData.telephone = `(${digits})`;
    },
    'userData.cep'(newValue) {
        if (!newValue || !this.userData) return;
        const digits = newValue.replace(/\D/g, '').slice(0, 8);
        this.userData.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    }
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (!this.token) {
      this.$router.push("/login");
      return;
    }
    try {
      // A chamada de API para buscar os dados
      const res = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      // Atribui os dados recebidos ao userData
      this.userData = res.data;
    } catch (err) {
      // Se a chamada falhar, faz o logout
      Swal.fire({
        title: 'Sessão Expirada',
        text: 'Por favor, faça o login novamente.',
        icon: 'warning',
        background: "#1F2937",
        color: "#E5E7EB"
      });
      localStorage.removeItem("token");
      this.$router.push("/login");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // Sua lógica de buscar o CEP está ótima, apenas ajustada para a nova estrutura
    async fetchAddressFromCep() {
      if (!this.userData.cep) return;
      const cep = this.userData.cep.replace(/\D/g, "");
      if (cep.length !== 8) return;

      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) return;
        
        this.userData.address = response.data.logradouro;
        this.userData.bairro = response.data.bairro;
        this.userData.city = response.data.localidade;
        this.userData.state = response.data.uf;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    },
    async handleEdit() {
      if (!this.userData || !this.userData._id) {
          Swal.fire("Erro", "Dados do usuário não encontrados.", "error");
          return;
      }
      try {
        await axios.put(`/api/users/${this.userData._id}`, this.userData, {
          headers: { 'Authorization': `Bearer ${this.token}` },
        });
        
        // Atualiza o localStorage com os novos dados
        localStorage.setItem("userData", JSON.stringify(this.userData));
        window.dispatchEvent(new Event("storage")); // Notifica outros componentes da mudança

        Swal.fire({
          title: "Dados Atualizados!",
          icon: "success",
          background: "#1F2937",
          color: "#E5E7EB",
          timer: 1500,
          showConfirmButton: false,
        });
        this.$router.push("/profile");
      } catch(error) {
        Swal.fire({
          title: 'Erro ao Atualizar',
          text: error.response?.data?.message || "Não foi possível atualizar seus dados.",
          icon: 'error',
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>