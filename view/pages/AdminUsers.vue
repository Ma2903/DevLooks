<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-12 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-[#04d1b0] flex items-center gap-3">
          <i class="fas fa-users-cog"></i>
          Gerenciar Usuários
        </h1>
        </div>

      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Nome</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Status</th>
                <th v-if="isOwner" class="px-6 py-4 text-center font-semibold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-if="loading" >
                <td :colspan="isOwner ? 5 : 4" class="text-center py-10">
                    <i class="fas fa-spinner fa-spin text-3xl text-[#04d1b0]"></i>
                </td>
              </tr>
              <tr v-else-if="users.length === 0">
                <td :colspan="isOwner ? 5 : 4" class="text-center py-10 text-gray-400">
                  <p><i class="fas fa-ghost mr-2"></i>Nenhum usuário encontrado.</p>
                </td>
              </tr>
              <tr v-for="user in users" :key="user._id" class="hover:bg-gray-700/50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-[#04d1b0]">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full',
                      user.role === 'owner' ? 'bg-purple-500/20 text-purple-300' :
                      user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                    ]"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                   <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full',
                      user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    ]"
                  >
                    {{ user.status === 'active' ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td v-if="isOwner" class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-4">
                <router-link v-if="user.role !== 'owner'" :to="`/admin/users/edit/${user._id}`" class="text-blue-400 hover:text-blue-300 transition" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                </router-link>

                <button v-if="user.role !== 'owner'" @click="confirmDelete(user)" class="text-red-500 hover:text-red-400 transition" title="Apagar">
                    <i class="fas fa-trash-alt"></i> Apagar
                </button>
            </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/services/main.js";
import Swal from 'sweetalert2';

export default {
    name: 'AdminUsers',
    data() {
        return {
            users: [],
            loading: true,
            isOwner: false,
            loggedInUserId: null
        };
    },
    async created() {
        this.checkUserRole();
        if (this.isOwner) {
            await this.fetchUsers();
        }
    },
    methods: {
        checkUserRole() {
            const userDataRaw = localStorage.getItem('userData');
            if (userDataRaw) {
                const userData = JSON.parse(userDataRaw);
                this.isOwner = userData.role === 'owner';
                this.loggedInUserId = userData._id;
            }
        },
        async fetchUsers() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                this.users = response.data;
            } catch (error) {
                Swal.fire({
                    title: 'Erro de Acesso!',
                    text: error.response?.data?.message || 'Não foi possível carregar os usuários.',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#e5e7eb'
                });
            } finally {
                this.loading = false;
            }
        },
        editUser(user) {
            // Lógica para editar será adicionada no próximo passo
            Swal.fire({
                title: 'Em breve!',
                text: `A funcionalidade para editar o usuário "${user.name}" será implementada a seguir.`,
                icon: 'info',
                background: '#1f2937',
                color: '#e5e7eb'
            });
        },
        confirmDelete(user) {
            Swal.fire({
                title: 'Tem a certeza?',
                text: `Esta ação irá apagar permanentemente o utilizador "${user.name}". Não é possível reverter.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, apagar!',
                cancelButtonText: 'Cancelar',
                background: '#1f2937',
                color: '#e5e7eb'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteUser(user._id);
                }
            });
        },
        async deleteUser(userId) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Remove o utilizador da lista local
                this.users = this.users.filter(u => u._id !== userId);

                Swal.fire({
                    title: 'Apagado!',
                    text: 'O utilizador foi apagado com sucesso.',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#e5e7eb'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível apagar o utilizador.',
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