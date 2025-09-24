<template>
  <div class="bg-gray-900 min-h-screen text-gray-200 py-8 px-4 flex items-center justify-center">
    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-[#04d1b0]"></i>
      <p class="mt-4 text-lg">Verificando seu perfil...</p>
    </div>

    <div v-else-if="canCreateAvatar" class="container mx-auto max-w-7xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-[#04d1b0] mb-4 flex items-center justify-center gap-3">
          <i class="fas fa-user-circle"></i>
          Crie seu Avatar Gratuito
        </h1>
        <p class="text-gray-400 text-lg">Personalize seu avatar com diferentes estilos e características.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <form @submit.prevent="saveAvatar" class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <i class="fas fa-cog text-[#04d1b0]"></i>
              Personalização
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-[#04d1b0] rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    Nome do Avatar
                  </div>
                  <input v-model="avatar.name" type="text" required placeholder="Digite um nome para o avatar" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300" />
                </label>
              </div>

              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-[#4e44e1] rounded-full flex items-center justify-center"><i class="fas fa-cut text-white text-sm"></i></div>
                    Estilo de Cabelo
                  </div>
                  <select v-model="avatar.topType" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300">
                    <option v-for="option in options.topType" :key="option" :value="option" class="bg-gray-700 text-white">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>

              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"><i class="fas fa-palette text-white text-sm"></i></div>
                    Cor do Cabelo
                  </div>
                  <select v-model="avatar.hairColor" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300">
                    <option v-for="option in options.hairColor" :key="option" :value="option" class="bg-gray-700 text-white">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>

              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"><i class="fas fa-glasses text-white text-sm"></i></div>
                    Acessórios
                  </div>
                  <select v-model="avatar.accessoriesType" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300">
                    <option v-for="option in options.accessoriesType" :key="option" :value="option" class="bg-gray-700 text-white">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>

              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><i class="fas fa-tshirt text-white text-sm"></i></div>
                    Roupa
                  </div>
                  <select v-model="avatar.clotheType" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300">
                    <option v-for="option in options.clotheType" :key="option" :value="option" class="bg-gray-700 text-white">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>

              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"><i class="fas fa-sun text-white text-sm"></i></div>
                    Cor da Pele
                  </div>
                  <select v-model="avatar.skinColor" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300">
                    <option v-for="option in options.skinColor" :key="option" :value="option" class="bg-gray-700 text-white">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>

              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"><i class="fas fa-image text-white text-sm"></i></div>
                    Tamanho PNG
                  </div>
                  <select v-model.number="pngSize" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition-all duration-300">
                    <option :value="200" class="bg-gray-700 text-white">200x200</option>
                    <option :value="400" class="bg-gray-700 text-white">400x400</option>
                    <option :value="600" class="bg-gray-700 text-white">600x600</option>
                  </select>
                </label>
              </div>
            </div>

            <button type="submit" class="w-full mt-8 bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-3">
              <i class="fas fa-save text-xl"></i>
              Salvar Avatar
            </button>
          </form>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 sticky top-8">
            <h3 class="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <i class="fas fa-eye text-[#04d1b0]"></i>
              Visualização
            </h3>
            <div class="flex flex-col items-center">
              <div class="relative mb-6">
                <img :src="avatarUrl" alt="Prévia do Avatar" class="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-[#04d1b0] shadow-2xl bg-gray-700 p-2 transition-transform duration-300 hover:scale-105" />
                <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-800">
                  <i class="fas fa-check text-white"></i>
                </div>
              </div>
              <div class="w-full space-y-3">
                <button @click="downloadSVG" :disabled="isDownloading" class="w-full bg-[#4e44e1] hover:bg-[#3e3ab8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2">
                  <i v-if="!isDownloading" class="fas fa-file-code"></i>
                  <i v-else class="fas fa-spinner fa-spin"></i>
                  {{ isDownloading ? 'Baixando...' : 'Baixar SVG' }}
                </button>
                <button @click="downloadPNG" :disabled="isDownloading" class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2">
                  <i v-if="!isDownloading" class="fas fa-file-image"></i>
                  <i v-else class="fas fa-spinner fa-spin"></i>
                  {{ isDownloading ? 'Processando...' : 'Baixar PNG' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container mx-auto max-w-2xl text-center">
       <div class="bg-gray-800 rounded-xl shadow-2xl p-10 border border-gray-700">
          <i class="fas fa-lock text-5xl text-yellow-400 mb-4"></i>
          <h1 class="text-3xl font-bold text-white mb-4">Você já usou seu avatar gratuito!</h1>
          <p class="text-gray-400 text-lg mb-8">
            Para criar um novo avatar e substituir o atual, você pode adquirir um "Slot de Avatar" em nossa loja.
          </p>
          <router-link
            to="/products"
            class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2 max-w-xs mx-auto"
          >
            <i class="fas fa-shopping-cart"></i>
            Comprar Slot de Avatar
          </router-link>
       </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'CreateAvatar',
  data() {
    return {
      loading: true,
      canCreateAvatar: false,
      isDownloading: false,
      avatar: {
        name: '',
        topType: 'ShortHairShortFlat',
        hairColor: 'Brown',
        accessoriesType: 'Blank',
        clotheType: 'BlazerShirt',
        skinColor: 'Light'
      },
      pngSize: 400,
      options: {
        topType: ['NoHair', 'Hat', 'Hijab', 'ShortHairShortFlat', 'LongHairStraight'],
        hairColor: ['Auburn', 'Black', 'Blonde', 'Brown', 'Red', 'SilverGray'],
        accessoriesType: ['Blank', 'Kurt', 'Prescription01', 'Sunglasses'],
        clotheType: ['BlazerShirt', 'BlazerSweater', 'Hoodie', 'ShirtCrewNeck'],
        skinColor: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']
      }
    };
  },
  computed: {
    avatarUrl() {
      const base = 'https://avataaars.io/';
      const query = new URLSearchParams({
        avatarStyle: 'Circle',
        topType: this.avatar.topType,
        accessoriesType: this.avatar.accessoriesType,
        hairColor: this.avatar.hairColor,
        clotheType: this.avatar.clotheType,
        skinColor: this.avatar.skinColor
      }).toString();
      return `${base}?${query}`;
    }
  },
  async mounted() {
    await this.checkUserAvatarStatus();
    // Preenche o nome do avatar com o nome do usuário como sugestão
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.name) {
      this.avatar.name = `${userData.name}'s Avatar`;
    }
  },
  methods: {
    async checkUserAvatarStatus() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        const res = await axios.get("/api/users/me", {}, { headers: { 'Authorization': `Bearer ${token}` } });
        const userData = res.data;
        
        localStorage.setItem('userData', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));

        this.canCreateAvatar = !userData.hasCreatedAvatar;

      } catch (error) {
        console.error("Erro ao verificar status do avatar:", error);
        this.canCreateAvatar = false;
        Swal.fire({ icon: 'error', title: 'Erro de Autenticação', text: 'Não foi possível verificar seu perfil. Faça login novamente.', background: '#1F2937', color: '#E5E7EB' });
        this.$router.push('/login');
      } finally {
        this.loading = false;
      }
    },
    async saveAvatar() {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Você precisa estar logado para salvar.', background: '#1F2937', color: '#E5E7EB' });
            return;
        }

        try {
            const response = await axios.put('/api/users/avatar', {
                avatarUrl: this.avatarUrl
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('storage'));

            Swal.fire({
                icon: 'success',
                title: 'Avatar Salvo!',
                text: 'Seu novo avatar já está no seu perfil.',
                background: '#1F2937',
                color: '#E5E7EB',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                this.$router.push('/profile');
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.error || 'Não foi possível salvar o avatar.',
                background: '#1F2937',
                color: '#E5E7EB'
            });
        }
    },
    
    // Métodos de Download (sem alterações)
    downloadSVG() { /* ... */ },
    async fetchAndDownloadSVG() { /* ... */ },
    fallbackSVGDownload() { /* ... */ },
    showDownloadError() { /* ... */ },
    downloadPNG() { /* ... */ },
    showPNGError() { /* ... */ },

    traduzir(valor) {
      const mapa = {
        NoHair: 'Sem cabelo', Hat: 'Chapéu', Hijab: 'Hijab', ShortHairShortFlat: 'Cabelo curto', LongHairStraight: 'Cabelo longo',
        Auburn: 'Ruivo escuro', Black: 'Preto', Blonde: 'Loiro', Brown: 'Castanho', Red: 'Ruivo', SilverGray: 'Grisalho',
        Blank: 'Nenhum', Kurt: 'Óculos Kurt', Prescription01: 'Óculos de Grau', Sunglasses: 'Óculos Escuros',
        BlazerShirt: 'Blazer e Camisa', BlazerSweater: 'Blazer e Suéter', Hoodie: 'Moletom', ShirtCrewNeck: 'Camisa Gola Careca',
        Tanned: 'Bronzeado', Yellow: 'Amarelo', Pale: 'Pálido', Light: 'Claro', Brown: 'Castanho', DarkBrown: 'Castanho Escuro', Black: 'Preto'
      };
      return mapa[valor] || valor;
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
select option { background-color: #374151; color: #e5e7eb; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
button:hover { transform: translateY(-1px); }
img:hover { transform: scale(1.05); }
</style>