<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center py-12 px-4">
    <div class="max-w-xl w-full">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-8 flex items-center justify-center gap-3">
        <i class="fas fa-user-edit"></i>
        Editar Utilizador
      </h1>
      
      <form @submit.prevent="updateUser" class="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 space-y-6" v-if="user">
        <div>
          <label for="name" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Nome</label>
          <input 
            v-model="user.name" 
            type="text" 
            id="name" 
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg cursor-not-allowed" 
            disabled
          >
        </div>
        
        <div>
          <label for="email" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Email</label>
          <input 
            v-model="user.email" 
            type="email" 
            id="email" 
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg cursor-not-allowed" 
            disabled
          >
        </div>

        <div>
            <label for="role" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Função (Role)</label>
            <select 
              v-model="user.role" 
              id="role" 
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" 
              required
            >
              <option value="user">Utilizador</option>
              <option value="admin">Administrador</option>
              <option value="owner">Proprietário (Owner)</option>
            </select>
        </div>
        
        <div class="flex justify-end pt-4 gap-4">
            <router-link to="/admin/users" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition">
                Cancelar
            </router-link>
            <button 
              type="submit" 
              class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
            >
              <i class="fas fa-save mr-2"></i>
              Salvar Alterações
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/services/main.js";
import Swal from 'sweetalert2';

export default {
    name: 'EditUserAdmin',
    data() {
        return {
            user: null
        };
    },
    async created() {
        const userId = this.$route.params.id;
        await this.fetchUser(userId);
    },
    methods: {
        async fetchUser(userId) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                this.user = response.data;
            } catch (error) {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível carregar os dados do utilizador.',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#e5e7eb'
                }).then(() => {
                    this.$router.push('/admin/users');
                });
            }
        },
        async updateUser() {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`/api/users/${this.user._id}`, {
                    role: this.user.role // Enviamos apenas o campo que queremos alterar
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                Swal.fire({
                    title: 'Sucesso!',
                    text: 'A função do utilizador foi atualizada.',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#e5e7eb'
                }).then(() => {
                    this.$router.push('/admin/users');
                });

            } catch (error) {
                 Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível atualizar o utilizador.',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#e5e7eb'
                });
            }
        }
    }
}
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>