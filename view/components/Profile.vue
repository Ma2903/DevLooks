<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-4 flex items-center justify-center">

    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-emerald-400"></i>
      <p class="text-xl mt-4">Carregando dados do perfil...</p>
    </div>

    <div v-else-if="user" class="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl p-8 border-t-4 border-emerald-400">
      
      <div class="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        
        <!-- Coluna de Informações do Usuário -->
        <div class="flex-grow md:border-r md:border-gray-700 md:pr-8">
          <div class="relative mb-6 md:mb-0 flex-shrink-0 mx-auto md:mx-0">
            <img :src="user.avatarUrl || 'https://i.pravatar.cc/150?u=' + user.email" alt="Avatar" class="w-36 h-36 rounded-full border-4 border-emerald-400 shadow-lg object-cover mx-auto">
          </div>
          
          <div class="mt-6">
            <h1 class="text-3xl lg:text-4xl font-bold text-white">{{ user.name }}</h1>
            <p class="text-gray-400 mt-2 text-lg">{{ user.email }}</p>
            <div class="mt-4 flex justify-center md:justify-start items-center gap-4">
              <span class="inline-block bg-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                {{ user.role }}
              </span>
              <span class="inline-block bg-sky-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                Passes de Avatar: {{ user.avatarPasses || 0 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Coluna de Ações -->
        <div class="flex flex-col items-center mt-8 md:mt-0 md:pl-8 gap-4 w-full md:w-1/3">
            <h2 class="text-2xl font-bold text-emerald-400 mb-2">Ações Rápidas</h2>
            <router-link :to="`/edit-user/${user._id}`" class="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
              <i class="fas fa-edit"></i>Editar Perfil
            </router-link>
            <router-link to="/my-orders" class="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
              <i class="fas fa-receipt"></i>Meus Pedidos
            </router-link>
            <button @click="confirmAccountDeletion" class="w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                <i class="fas fa-trash-alt"></i>Deletar Conta
            </button>
        </div>
      </div>

      <div v-if="user.savedAvatars && user.savedAvatars.length > 0" class="mt-10 pt-8 border-t border-gray-700">
        <h2 class="text-2xl font-bold text-center text-emerald-400 mb-6">Minha Galeria de Avatares</h2>
        <div class="flex justify-center flex-wrap gap-5">
          
          <div v-for="(avatar, index) in user.savedAvatars" :key="index" class="relative group">
            <img
              :src="avatar"
              alt="Avatar Salvo"
              class="w-24 h-24 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30"
              :class="user.avatarUrl === avatar ? 'border-emerald-400 ring-2 ring-emerald-400' : 'border-gray-600 hover:border-emerald-400/50'"
              @click="changeProfilePicture(avatar)"
              title="Definir como foto de perfil"
            />
            <button @click.stop="confirmAvatarDelete(avatar)" class="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir Avatar">
              <i class="fas fa-times text-sm"></i>
            </button>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
               <button @click.stop="exportAvatar(avatar, 'png')" class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md" title="Exportar PNG">PNG</button>
               <button @click.stop="exportAvatar(avatar, 'svg')" class="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md" title="Exportar SVG">SVG</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '@/services/main.js';
import axios from 'axios';

const router = useRouter();
const user = ref(null);
const loading = ref(true);

async function fetchUser() {
  if (!user.value) loading.value = true;
  try {
    const response = await api.get('/api/users/me');
    user.value = response.data;
    localStorage.setItem('userData', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    logout(true);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('userData');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    loading.value = false;
    fetchUser();
  } else {
    fetchUser();
  }
});

function logout(force = false) {
  const performLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };
  if (force) {
    performLogout();
    return;
  }
  Swal.fire({
    title: 'Você tem certeza?', text: "Você será desconectado.", icon: 'warning',
    showCancelButton: true, confirmButtonColor: '#10B981', cancelButtonColor: '#EF4444',
    confirmButtonText: 'Sim, quero sair!', cancelButtonText: 'Cancelar',
    background: "#1F2937", color: "#E5E7EB"
  }).then((result) => {
    if (result.isConfirmed) {
      performLogout();
    }
  });
}

async function changeProfilePicture(avatarUrl) {
  try {
    const response = await api.put('/api/users/avatar', { avatarUrl });
    user.value = response.data.user;
    localStorage.setItem('userData', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
    Swal.fire({
      icon: 'success', title: 'Sucesso!', text: 'Sua foto de perfil foi alterada.',
      background: "#1F2937", color: "#E5E7EB", timer: 2000, showConfirmButton: false
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Não foi possível alterar a foto de perfil.';
    Swal.fire({ icon: 'error', title: 'Erro', text: errorMessage, background: "#1F2937", color: "#E5E7EB" });
  }
}

function confirmAvatarDelete(avatarUrl) {
  if (user.value.avatarUrl === avatarUrl) {
    Swal.fire({
      icon: 'warning', title: 'Aviso', text: 'Você não pode excluir seu avatar de perfil ativo.',
      background: "#1F2937", color: "#E5E7EB"
    });
    return;
  }
  Swal.fire({
    title: 'Excluir Avatar?', text: "Esta ação é irreversível.", icon: 'warning',
    showCancelButton: true, confirmButtonColor: '#d33', cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, excluir!', background: "#1F2937", color: "#E5E7EB"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteAvatar(avatarUrl);
    }
  });
}

async function deleteAvatar(avatarUrl) {
  try {
    // Chama a nova rota DELETE com a URL no corpo da requisição
    const response = await api.delete('/api/users/avatar', { data: { avatarUrl } });
    user.value = response.data.user;
    localStorage.setItem('userData', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
    Swal.fire({ 
      icon: 'success', 
      title: 'Excluído!', 
      text: 'O avatar foi removido da sua galeria.', 
      background: "#1F2937", 
      color: "#E5E7EB", 
      timer: 2000, 
      showConfirmButton: false 
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Não foi possível excluir o avatar.';
    Swal.fire({ icon: 'error', title: 'Erro', text: errorMessage, background: "#1F2937", color: "#E5E7EB" });
  }
}

async function exportAvatar(avatarUrl, format) {
  try {
    const proxyUrl = `http://localhost:3000/api/avatar/proxy?url=${encodeURIComponent(avatarUrl)}`;
    const response = await axios.get(proxyUrl, { responseType: 'blob' });
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devlooks-avatar.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    Swal.fire({
      title: 'Erro de Download', text: 'Não foi possível baixar o avatar.', icon: 'error',
      background: "#1F2937", color: "#E5E7EB",
    });
  }
}

// --- FUNÇÕES PARA DELETAR A CONTA ADICIONADAS AQUI ---
function confirmAccountDeletion() {
  Swal.fire({
    title: 'Deletar sua conta?',
    text: "Esta ação é permanente e não pode ser desfeita. Todos os seus dados, incluindo perfil, avatares e histórico de compras, serão apagados.",
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, deletar minha conta!',
    background: "#1F2937",
    color: "#E5E7EB"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteAccount();
    }
  });
}

async function deleteAccount() {
  try {
    await api.delete('/api/users/me'); // Chama a nova rota no backend
    await Swal.fire({
      title: 'Conta Deletada!',
      text: 'Sua conta foi removida com sucesso.',
      icon: 'success',
      background: "#1F2937",
      color: "#E5E7EB",
      timer: 3000,
      showConfirmButton: false,
    });
    logout(true); // Força o logout e redireciona
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao deletar sua conta.';
    Swal.fire({ icon: 'error', title: 'Erro', text: errorMessage, background: "#1F2937", color: "#E5E7EB" });
  }
}
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>