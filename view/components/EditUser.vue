<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
      <div class="text-center mb-10">
        <img src="../assets/Logo.png" alt="Logo" class="w-28 h-28 mx-auto rounded-full shadow-lg">
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-6">Editar Perfil</h1>
        <p class="text-gray-400 mt-3 text-lg">Atualize suas informações pessoais</p>
      </div>
      
      <form v-if="userData" @submit.prevent="handleEdit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <div class="relative flex items-center">
              <i class="fas fa-user absolute left-4 text-gray-400 z-10"></i>
              <input type="text" id="name" v-model="userData.name"
                      class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                      placeholder="Digite seu nome" required />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative flex items-center">
              <i class="fas fa-envelope absolute left-4 text-gray-400 z-10"></i>
              <input type="email" id="email" v-model="userData.email"
                      class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                      placeholder="exemplo@email.com" required />
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <div class="relative flex items-center gap-2">
              <div class="relative flex-grow">
                <i class="fas fa-map-pin absolute left-4 text-gray-400 z-10 top-1/2 -translate-y-1/2"></i>
                <input 
                  type="text" 
                  id="cep" 
                  v-model="userData.address.cep" 
                  @input="applyCepMask" 
                  class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                  placeholder="00000-000"
                  maxlength="9"
                />
              </div>
              <button 
                type="button" 
                @click="buscarCepManualmente" 
                class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-3 px-6 rounded-lg transition-colors flex-shrink-0"
                aria-label="Buscar CEP"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="street" class="block text-sm font-medium text-gray-300 mb-2">Endereço (Rua/Avenida)</label>
            <input type="text" id="street" v-model="userData.address.street"
                    class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                    placeholder="Preenchido pelo CEP" />
          </div>
          
          <div class="grid grid-cols-2 gap-x-4 md:col-span-2">
              <div>
                <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
                <input type="text" id="number" v-model="userData.address.number"
                        class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                        placeholder="Ex: 123" />
              </div>
              <div>
                <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento</label>
                <input type="text" id="complement" v-model="userData.address.complement"
                        class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                        placeholder="Apto, Bloco, etc."/>
              </div>
          </div>

          <div>
            <label for="neighborhood" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <input type="text" id="neighborhood" v-model="userData.address.neighborhood"
                    class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                    placeholder="Preenchido pelo CEP" />
          </div>

          <div class="grid grid-cols-2 gap-x-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
              <input type="text" id="city" v-model="userData.address.city"
                      class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                      placeholder="Preenchido pelo CEP" />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <input type="text" id="state" v-model="userData.address.state"
                      class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                      placeholder="Preenchido pelo CEP" />
            </div>
          </div>
          
        </div>
        
        <div class="mt-8 flex flex-col md:flex-row gap-4">
          <button type="submit" class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <i class="fas fa-save mr-2"></i> Salvar Alterações
          </button>
          <router-link to="/profile" class="w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
            Cancelar
          </router-link>
        </div>
      </form>

      <div v-else class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-[#04d1b0]"></i>
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
</style>