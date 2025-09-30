<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 border-t-4 border-emerald-400">
      <h1 class="text-3xl font-bold text-center text-white mb-8">Editar Perfil</h1>
      
      <form v-if="userData" @submit.prevent="handleEdit">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <input type="text" id="name" v-model="userData.name" class="form-input" required>
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" id="email" v-model="userData.email" class="form-input" required>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-white mt-6 mb-4 border-b border-gray-700 pb-2">Endereço</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="mb-4 md:col-span-3 flex items-end gap-2">
            <div class="flex-grow">
              <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
              <input 
                type="text" 
                id="cep" 
                v-model="userData.address.cep" 
                @input="applyCepMask" 
                class="form-input" 
                placeholder="00000-000"
                maxlength="9"
              >
            </div>
            <button 
              type="button" 
              @click="buscarCepManualmente" 
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors h-[48px] flex-shrink-0"
              aria-label="Buscar CEP"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <div class="mb-4 md:col-span-2">
            <label for="street" class="block text-sm font-medium text-gray-300 mb-2">Rua</label>
            <input type="text" id="street" v-model="userData.address.street" class="form-input">
          </div>
           <div class="mb-4">
            <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
            <input type="text" id="number" v-model="userData.address.number" class="form-input">
          </div>
          <div class="mb-4">
            <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento</label>
            <input type="text" id="complement" v-model="userData.address.complement" class="form-input">
          </div>
          <div class="mb-4">
            <label for="neighborhood" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <input type="text" id="neighborhood" v-model="userData.address.neighborhood" class="form-input">
          </div>
          <div class="mb-4">
            <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
            <input type="text" id="city" v-model="userData.address.city" class="form-input">
          </div>
          <div class="mb-4">
            <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <input type="text" id="state" v-model="userData.address.state" class="form-input">
          </div>
        </div>

        <div class="mt-8 flex flex-col md:flex-row gap-4">
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
            <i class="fas fa-save"></i>Salvar Alterações
          </button>
          <router-link to="/profile" class="w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Cancelar
          </router-link>
        </div>
      </form>

      <div v-else class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-emerald-400"></i>
          <p class="mt-4 text-lg">Carregando dados do usuário...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "@/services/main.js";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      userData: null,
      token: null,
    };
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (!this.token) {
      this.$router.push("/login");
      return;
    }
    try {
      const userId = this.$route.params.id;
      const res = await api.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.userData = res.data;

      // *** AQUI ESTÁ A CORREÇÃO PRINCIPAL ***
      // Garante que `address` seja sempre um objeto.
      if (typeof this.userData.address !== 'object' || this.userData.address === null) {
        this.userData.address = {};
      }
      
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      Swal.fire({
          icon: 'error', title: 'Erro', text: 'Não foi possível carregar os dados do usuário.',
          background: "#1F2937", color: "#E5E7EB"
      });
      this.$router.push("/profile");
    }
  },
  methods: {
    applyCepMask(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 5) {
          value = value.slice(0, 5) + '-' + value.slice(5, 8);
      }
      // Garante que o objeto `address` existe antes de atribuir
      if (!this.userData.address) {
        this.userData.address = {};
      }
      this.userData.address.cep = value;
    },
    buscarCepManualmente() {
      const cep = this.userData.address.cep;
      if (cep && cep.length === 9) {
        this.fetchAddressFromCep(cep);
      } else {
        Swal.fire({
            icon: 'warning', 
            title: 'CEP Inválido', 
            text: 'Por favor, digite um CEP válido com 8 dígitos.',
            background: "#1F2937", 
            color: "#E5E7EB"
        });
      }
    },
    async fetchAddressFromCep(cep) {
      const cleanCep = cep.replace(/\D/g, '');
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = response.data;
        if (!data.erro) {
          this.userData.address.street = data.logradouro;
          this.userData.address.neighborhood = data.bairro;
          this.userData.address.city = data.localidade;
          this.userData.address.state = data.uf;
        } else {
           Swal.fire({
            icon: 'error', 
            title: 'CEP não encontrado', 
            text: 'Não foi possível encontrar o endereço para o CEP informado.',
            background: "#1F2937", 
            color: "#E5E7EB"
           });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
         Swal.fire({
            icon: 'error', 
            title: 'Erro de Rede', 
            text: 'Ocorreu um erro ao buscar o CEP. Tente novamente.',
            background: "#1F2937", 
            color: "#E5E7EB"
        });
      }
    },
    async handleEdit() {
      if (!this.userData.name || !this.userData.email) {
        Swal.fire({
            icon: 'error', title: 'Erro', text: 'Nome e email são obrigatórios.',
            background: "#1F2937", color: "#E5E7EB"
        });
        return;
      }
      try {
        await api.put(`/api/users/${this.userData._id}`, this.userData, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });

        const loggedInUser = JSON.parse(localStorage.getItem('userData'));
        if(loggedInUser && loggedInUser._id === this.userData._id) {
          localStorage.setItem('userData', JSON.stringify(this.userData));
          window.dispatchEvent(new Event('auth-change'));
        }

        await Swal.fire({
            icon: 'success', title: 'Sucesso!', text: 'Dados atualizados com sucesso.',
            background: "#1F2937", color: "#E5E7EB", timer: 2000, showConfirmButton: false
        });
        this.$router.push("/profile");
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        Swal.fire({
            icon: 'error', title: 'Erro', text: 'Não foi possível atualizar os dados.',
            background: "#1F2937", color: "#E5E7EB"
        });
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.form-input {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background-color: #374151;
  color: #e5e7eb;
  border-radius: 0.5rem;
  outline: none;
  border: 1px solid #4b5563;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.form-input:focus {
  box-shadow: 0 0 0 2px #10b981;
  border-color: #10b981;
}
</style>