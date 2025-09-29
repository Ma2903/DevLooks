<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
    <div v-if="user" class="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-8">
      
      <div class="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        <div class="relative mb-4 md:mb-0 md:mr-8">
          <img :src="user.avatarUrl || 'https://i.pravatar.cc/150?u=' + user.email" alt="Avatar" class="w-32 h-32 rounded-full border-4 border-emerald-400 shadow-lg object-cover">
        </div>
        
        <div class="flex-grow">
          <h1 class="text-3xl font-bold text-white">{{ user.name }}</h1>
          <p class="text-gray-400 mt-1">{{ user.email }}</p>
          <div class="mt-3 flex justify-center md:justify-start items-center gap-4">
            <span class="inline-block bg-emerald-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {{ user.role }}
            </span>
            <span class="inline-block bg-sky-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
              Passes de Avatar: {{ user.avatarPasses || 0 }}
            </span>
          </div>
        </div>

        <div class="flex flex-col items-center mt-4 md:mt-0 md:ml-4 gap-2">
            <router-link :to="`/edit-user/${user._id}`" class="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              <i class="fas fa-edit mr-2"></i>Editar Perfil
            </router-link>
            <button @click="confirmLogout" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              <i class="fas fa-sign-out-alt mr-2"></i>Sair
            </button>
        </div>
      </div>

      <div v-if="user.savedAvatars && user.savedAvatars.length > 0" class="mt-10 pt-6 border-t border-gray-700">
        <h2 class="text-xl font-bold text-center text-emerald-400 mb-6">Minha Galeria de Avatares</h2>
        <div class="flex justify-center flex-wrap gap-5">
          
          <div v-for="(avatar, index) in user.savedAvatars" :key="index" class="relative group">
            <img
              :src="avatar"
              alt="Avatar Salvo"
              class="w-24 h-24 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30"
              :class="user.avatarUrl === avatar ? 'border-emerald-400' : 'border-gray-600 hover:border-emerald-400/50'"
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
    <div v-else class="text-center">
      <p class="text-xl">Carregando dados do perfil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '@/services/main.js'; // << ESTA LINHA FOI CORRIGIDA

const router = useRouter();
const user = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  } else {
    fetchUser();
  }
});

async function fetchUser() {
  try {
    const response = await api.get('/api/users/me');
    user.value = response.data;
    localStorage.setItem('user', JSON.stringify(user.value));
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    logout();
  }
}

function confirmLogout() {
  Swal.fire({
    title: 'Você tem certeza?',
    text: "Você será desconectado da sua conta.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, sair!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-change'));
  router.push('/login');
}

async function changeProfilePicture(avatarUrl) {
  try {
    const response = await api.post('/api/avatar', { avatarUrl });
    user.value = response.data.user;
    localStorage.setItem('user', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
    Swal.fire('Sucesso!', 'Sua foto de perfil foi alterada.', 'success');
  } catch (error) {
    Swal.fire('Erro', 'Não foi possível alterar a foto de perfil.', 'error');
  }
}

function confirmAvatarDelete(avatarUrl) {
  if (user.value.avatarUrl === avatarUrl) {
    Swal.fire('Aviso', 'Você não pode excluir seu avatar de perfil ativo. Troque de avatar antes de excluir.', 'warning');
    return;
  }
  Swal.fire({
    title: 'Excluir Avatar?',
    text: "Esta ação é irreversível.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, excluir!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteAvatar(avatarUrl);
    }
  });
}

async function deleteAvatar(avatarUrl) {
  try {
    const response = await api.delete('/api/avatar', { data: { avatarUrl } });
    user.value = response.data.user;
    localStorage.setItem('user', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
    Swal.fire('Excluído!', 'O avatar foi removido da sua galeria.', 'success');
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Não foi possível excluir o avatar.';
    Swal.fire('Erro', errorMessage, 'error');
  }
}

function exportAvatar(avatarUrl, format) {
  const link = document.createElement('a');
  if (format === 'svg' && avatarUrl.startsWith('data:image/svg+xml')) {
    link.href = avatarUrl;
    link.download = `devlooks-avatar.svg`;
  } else if (format === 'png') {
    link.href = avatarUrl;
    link.download = `devlooks-avatar.png`;
  } else {
    Swal.fire('Ops!', 'A exportação para SVG só está disponível para avatares vetoriais.', 'info');
    return;
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>