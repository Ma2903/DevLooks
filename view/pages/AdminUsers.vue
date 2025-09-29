<template>
  <div class="container mx-auto p-6 bg-gray-900 min-h-screen text-white">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-emerald-400 flex items-center gap-3">
        <i class="fas fa-users-cog"></i>
        Gerenciar Usuários
      </h1>
      <div class="flex items-center gap-4 mt-4 md:mt-0">
        <button @click="exportData('json')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
          <i class="fas fa-file-code"></i> Exportar JSON
        </button>
        <button @click="exportData('csv')"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
          <i class="fas fa-file-csv"></i> Exportar CSV
        </button>
      </div>
    </div>

    <div class="bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-700">
          <tr>
            <th class="p-4 uppercase text-sm font-semibold">Nome</th>
            <th class="p-4 uppercase text-sm font-semibold">Email</th>
            <th class="p-4 uppercase text-sm font-semibold">Role</th>
            <th class="p-4 uppercase text-sm font-semibold">Status</th>
            <th class="p-4 uppercase text-sm font-semibold text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="border-b border-gray-700 hover:bg-gray-700/50">
            <td class="p-4">{{ user.name }}</td>
            <td class="p-4">{{ user.email }}</td>
            <td class="p-4">
              <span :class="roleClass(user.role)" class="px-2 py-1 rounded-full text-xs font-bold text-gray-900">
                {{ user.role }}
              </span>
            </td>
            <td class="p-4">
              <span :class="user.status === 'active' ? 'text-green-400' : 'text-yellow-400'">
                {{ user.status }}
              </span>
            </td>
            <td class="p-4 flex justify-center items-center gap-3">
              <router-link :to="`/admin/users/edit/${user._id}`" class="text-blue-400 hover:text-blue-300">
                <i class="fas fa-edit"></i>
              </router-link>
              <button @click="confirmDelete(user._id)" class="text-red-500 hover:text-red-400">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/main.js'; // << ESTA LINHA FOI CORRIGIDA
import Swal from 'sweetalert2';

const users = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('/api/admin/users');
    users.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    Swal.fire('Erro', 'Não foi possível carregar a lista de usuários.', 'error');
  }
});

function roleClass(role) {
  switch (role) {
    case 'owner': return 'bg-yellow-400';
    case 'admin': return 'bg-blue-400';
    default: return 'bg-gray-400';
  }
}

function confirmDelete(userId) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Esta ação não pode ser revertida!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, deletar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUser(userId);
    }
  });
}

async function deleteUser(userId) {
  try {
    await api.delete(`/api/admin/users/${userId}`);
    users.value = users.value.filter(u => u._id !== userId);
    Swal.fire('Deletado!', 'O usuário foi removido.', 'success');
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    Swal.fire('Erro', 'Não foi possível deletar o usuário.', 'error');
  }
}

async function exportData(format) {
  try {
    const response = await api.get(`/api/admin/users/export?format=${format}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_usuarios.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(`Erro ao exportar para ${format}:`, error);
    Swal.fire('Erro', `Não foi possível exportar o relatório em ${format.toUpperCase()}.`, 'error');
  }
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>