<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 md:p-20 rounded-3xl shadow-2xl w-full max-w-6xl">
      <div class="text-center mb-10">
        <i class="fas fa-user-edit text-6xl text-[#04d1b0] mb-4"></i>
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-2">Editar Dados</h1>
        <p class="text-gray-400 mt-3 text-lg">Atualize suas informações abaixo</p>
      </div>
      
      <div v-if="loading" class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-3xl text-[#04d1b0]"></i>
        <p class="mt-2">A carregar os seus dados...</p>
      </div>

      <form @submit.prevent="handleEdit" v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="name" v-model="userData.name" class="w-full pl-10 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition">
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative">
              <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="email" id="email" v-model="userData.email" class="w-full pl-10 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" readonly disabled>
            </div>
          </div>

          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
            <div class="relative">
              <i class="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="cpf" v-model="userData.cpf" @input="formatCpf" class="w-full pl-10 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" maxlength="14">
            </div>
          </div>
          
          <div>
            <label for="telephone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <div class="relative">
              <i class="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="tel" id="telephone" v-model="userData.telephone" @input="formatTelephone" class="w-full pl-10 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" maxlength="15">
            </div>
          </div>

          <div class="md:col-span-2">
            <hr class="border-gray-700 my-4">
            <p class="text-lg font-semibold text-center text-[#04d1b0]">Endereço</p>
          </div>

          <div class="relative">
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <input type="text" id="cep" v-model="userData.cep" @input="formatCep" @blur="handleCepBlur" class="w-full pl-4 pr-10 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" maxlength="9">
            <i v-if="isCepLoading" class="fas fa-spinner fa-spin absolute right-3 top-11 text-gray-400"></i>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
            <input type="text" id="address" v-model="userData.address" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" :disabled="isCepLoading">
          </div>

          <div>
            <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
            <input type="text" id="number" v-model="userData.number" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition">
          </div>

          <div>
            <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento</label>
            <input type="text" id="complement" v-model="userData.complement" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition">
          </div>
          
          <div>
            <label for="bairro" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <input type="text" id="bairro" v-model="userData.bairro" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" :disabled="isCepLoading">
          </div>
          
          <div>
            <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
            <input type="text" id="city" v-model="userData.city" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" :disabled="isCepLoading">
          </div>
          
          <div>
            <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <input type="text" id="state" v-model="userData.state" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition" :disabled="isCepLoading">
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-300 mb-2">País</label>
            <input type="text" id="country" v-model="userData.country" class="w-full py-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[#04d1b0] focus:ring-1 focus:ring-[#04d1b0] transition">
          </div>
        </div>
        
        <div class="mt-10 text-center">
          <button type="submit" class="w-full md:w-auto bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-12 rounded-lg shadow-lg">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/services/main.js';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "EditUser",
  data() {
    return {
      userData: {
        name: '', email: '', cpf: '', telephone: '',
        cep: '', address: '', number: '', complement: '',
        bairro: '', city: '', state: '', country: ''
      },
      loading: true,
      isCepLoading: false,
    };
  },
  async created() {
    this.loading = true;
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
      return;
    }
    try {
      const response = await api.post('/api/users/me', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      this.userData = response.data;
    } catch (err) {
      localStorage.removeItem("token");
      this.$router.push("/login");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatCpf(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.userData.cpf = value;
    },
    formatTelephone(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      this.userData.telephone = value;
    },
    formatCep(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      this.userData.cep = value;
    },
    async handleCepBlur() {
      if (!this.userData.cep) {
        return;
      }
      const cep = this.userData.cep.replace(/\D/g, '');
      if (cep.length === 8) {
        this.isCepLoading = true;
        try {
          const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
          if (data.erro) {
            Swal.fire({ icon: 'error', title: 'CEP não encontrado', background: '#1F2937', color: '#E5E7EB' });
            return;
          }
          this.userData.address = data.logradouro;
          this.userData.bairro = data.bairro;
          this.userData.city = data.localidade;
          this.userData.state = data.uf;
          this.userData.country = "Brasil";
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          Swal.fire({ icon: 'error', title: 'Erro de Rede', text: 'Não foi possível buscar o CEP.', background: '#1F2937', color: '#E5E7EB' });
        } finally {
          this.isCepLoading = false;
        }
      }
    },
    async handleEdit() {
      const token = localStorage.getItem("token");
      try {
        await api.put(`/api/users/${this.userData._id}`, this.userData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        Swal.fire({
          title: "Dados Atualizados!",
          icon: "success",
          background: "#1F2937",
          color: "#E5E7EB",
        });
        this.$router.push("/profile");
      } catch(error) {
        Swal.fire({
          title: "Erro ao Atualizar",
          text: error.response?.data?.error || "Ocorreu um erro.",
          icon: "error",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
  },
};
</script>