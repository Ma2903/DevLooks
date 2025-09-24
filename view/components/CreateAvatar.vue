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
          Crie seu Avatar
        </h1>
        <p v-if="!user.hasCreatedAvatar" class="text-gray-400 text-lg">Personalize seu avatar gratuito com diferentes estilos.</p>
        <p v-if="user && user.hasCreatedAvatar" class="text-lg text-yellow-400 mt-2">
            <i class="fas fa-ticket-alt"></i> Você tem {{ user.avatarPasses }} passes de avatar.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <form @submit.prevent="saveAvatar" class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <i class="fas fa-cog text-[#04d1b0]"></i>
              Personalização
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-[#4e44e1]"><i class="fas fa-cut"></i></div>Estilo de Cabelo</div>
                  <select v-model="avatarOptions.topType" class="select-input">
                    <option v-for="option in options.topType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-orange-500"><i class="fas fa-glasses"></i></div>Acessórios</div>
                  <select v-model="avatarOptions.accessoriesType" class="select-input">
                    <option v-for="option in options.accessoriesType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-pink-500"><i class="fas fa-palette"></i></div>Cor do Cabelo</div>
                  <select v-model="avatarOptions.hairColor" class="select-input">
                    <option v-for="option in options.hairColor" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-gray-500"><i class="fas fa-user-secret"></i></div>Barba / Bigode</div>
                  <select v-model="avatarOptions.facialHairType" class="select-input">
                    <option v-for="option in options.facialHairType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-green-500"><i class="fas fa-tshirt"></i></div>Roupa</div>
                  <select v-model="avatarOptions.clotheType" class="select-input">
                    <option v-for="option in options.clotheType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-blue-500"><i class="fas fa-eye"></i></div>Olhos</div>
                  <select v-model="avatarOptions.eyeType" class="select-input">
                    <option v-for="option in options.eyeType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-purple-500"><i class="fas fa-angle-double-up"></i></div>Sobrancelha</div>
                  <select v-model="avatarOptions.eyebrowType" class="select-input">
                    <option v-for="option in options.eyebrowType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-red-500"><i class="fas fa-mouth-guard"></i></div>Boca</div>
                  <select v-model="avatarOptions.mouthType" class="select-input">
                    <option v-for="option in options.mouthType" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-yellow-500"><i class="fas fa-sun"></i></div>Cor da Pele</div>
                  <select v-model="avatarOptions.skinColor" class="select-input">
                    <option v-for="option in options.skinColor" :key="option" :value="option">{{ traduzir(option) }}</option>
                  </select>
                </label>
              </div>
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3"><div class="option-icon bg-indigo-500"><i class="fas fa-image"></i></div>Tamanho PNG</div>
                  <select v-model.number="pngSize" class="select-input">
                    <option :value="200">200x200</option>
                    <option :value="400">400x400</option>
                    <option :value="600">600x600</option>
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
            <h3 class="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3"><i class="fas fa-eye text-[#04d1b0]"></i>Visualização</h3>
            <div class="flex flex-col items-center">
              <div class="relative mb-6">
                <img :src="proxiedAvatarUrl" alt="Prévia do Avatar" class="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-[#04d1b0] shadow-2xl bg-gray-700 p-2 transition-transform duration-300 hover:scale-105" />
                <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-800"><i class="fas fa-check text-white"></i></div>
              </div>
              <div class="w-full space-y-3">
                <button @click="downloadSVG" :disabled="isDownloading" class="download-button bg-[#4e44e1] hover:bg-[#3e3ab8]">
                  <i v-if="!isDownloading" class="fas fa-file-code"></i><i v-else class="fas fa-spinner fa-spin"></i>
                  {{ isDownloading ? 'Baixando...' : 'Baixar SVG' }}
                </button>
                <button @click="downloadPNG" :disabled="isDownloading" class="download-button bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90">
                  <i v-if="!isDownloading" class="fas fa-file-image"></i><i v-else class="fas fa-spinner fa-spin"></i>
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
          Para criar um novo avatar, você precisa de um "Passe de Avatar". Você pode adquiri-los em nossa loja.
        </p>
        <router-link to="/products" class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2 max-w-xs mx-auto">
          <i class="fas fa-shopping-cart"></i>
          Comprar Passe de Avatar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "CreateAvatar",
  data() {
    return {
      avatarOptions: {
        topType: 'NoHair', accessoriesType: 'Blank', hairColor: 'BrownDark', facialHairType: 'Blank', clotheType: 'BlazerShirt', eyeType: 'Default', eyebrowType: 'Default', mouthType: 'Default', skinColor: 'Light'
      },
      options: {
        topType: ['NoHair', 'LongHairBigHair', 'ShortHairShortFlat', 'LongHairStraight', 'ShortHairTheCaesar', 'Hat', 'WinterHat1', 'Hijab'],
        accessoriesType: ['Blank', 'Prescription02', 'Kurt', 'Round', 'Wayfarers', 'Sunglasses'],
        hairColor: ['BrownDark', 'Blonde', 'Red', 'Black', 'PastelPink', 'Blue', 'Auburn', 'SilverGray'],
        facialHairType: ['Blank', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
        clotheType: ['BlazerShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'GraphicShirt', 'BlazerSweater', 'CollarSweater'],
        eyeType: ['Default', 'Happy', 'Wink', 'Squint', 'Surprised', 'Cry', 'Dizzy', 'EyeRoll'],
        eyebrowType: ['Default', 'RaisedExcited', 'UpDown', 'Angry', 'SadConcerned', 'FlatNatural'],
        mouthType: ['Default', 'Smile', 'Serious', 'Twinkle', 'Eating', 'Concerned', 'Disbelief', 'Vomit'],
        skinColor: ['Light', 'Tanned', 'DarkBrown', 'Black', 'Pale', 'Yellow', 'Brown'],
      },
      pngSize: 400,
      isDownloading: false,
      token: null,
      user: null,
      loading: true,
    };
  },
  computed: {
    // LÓGICA ATUALIZADA
    canCreateAvatar() {
      if (!this.user) return false;
      // Pode criar se ainda não criou o gratuito OU se tem passes
      return !this.user.hasCreatedAvatar || (this.user.avatarPasses && this.user.avatarPasses > 0);
    },
    avatarUrl() {
      const baseUrl = 'https://avataaars.io/?';
      const params = new URLSearchParams(this.avatarOptions).toString();
      return `${baseUrl}${params}`;
    },
    proxiedAvatarUrl() {
      if (!this.avatarUrl) return '';
      const externalUrl = encodeURIComponent(this.avatarUrl);
      return `http://localhost:3000/api/avatar/proxy?url=${externalUrl}`;
    }
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (!this.token) {
      this.$router.push("/login");
      return;
    }
    try {
      const res = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.user = res.data;
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      localStorage.removeItem("token");
      this.$router.push("/login");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // ... (seu método 'traduzir' continua igual)
     traduzir(option) {
      const traducoes = {
        'NoHair': 'Careca', 'LongHairBigHair': 'Cabelo Grande', 'ShortHairShortFlat': 'Cabelo Curto', 'LongHairStraight': 'Cabelo Longo Liso', 'ShortHairTheCaesar': 'Corte César', 'Hat': 'Chapéu', 'WinterHat1': 'Gorro', 'Hijab': 'Hijab',
        'BrownDark': 'Castanho Escuro', 'Blonde': 'Loiro', 'Red': 'Ruivo', 'Black': 'Preto', 'PastelPink': 'Rosa Pastel', 'Blue': 'Azul', 'Auburn': 'Ruivo Acobreado', 'SilverGray': 'Grisalho',
        'Blank': 'Nenhum', 'Prescription02': 'Óculos de Grau', 'Kurt': 'Óculos Kurt', 'Round': 'Óculos Redondo', 'Wayfarers': 'Óculos Wayfarers', 'Sunglasses': 'Óculos de Sol',
        'BeardLight': 'Barba Rala', 'BeardMajestic': 'Barba Cheia', 'MoustacheFancy': 'Bigode Chique', 'MoustacheMagnum': 'Bigode Magnum',
        'BlazerShirt': 'Blazer e Camisa', 'Hoodie': 'Moletom', 'Overall': 'Macacão', 'ShirtCrewNeck': 'Camiseta Gola Redonda', 'GraphicShirt': 'Camiseta Estampada', 'BlazerSweater': 'Blazer e Suéter', 'CollarSweater': 'Suéter com Gola',
        'Default': 'Normal', 'Happy': 'Feliz', 'Wink': 'Piscando', 'Squint': 'Semicerrado', 'Surprised': 'Surpreso', 'Cry': 'Chorando', 'Dizzy': 'Tonto', 'EyeRoll': 'Virando os Olhos',
        'RaisedExcited': 'Animado', 'UpDown': 'Assimétrica', 'Angry': 'Bravo', 'SadConcerned': 'Triste', 'FlatNatural': 'Reta',
        'Smile': 'Sorrindo', 'Serious': 'Sério', 'Twinkle': 'Radiante', 'Eating': 'Comendo', 'Concerned': 'Preocupado', 'Disbelief': 'Incrédulo', 'Vomit': 'Vômito',
        'Light': 'Clara', 'Tanned': 'Bronzeada', 'DarkBrown': 'Morena', 'Black': 'Negra', 'Pale': 'Pálida', 'Yellow': 'Amarela', 'Brown': 'Marrom'
      };
      return traducoes[option] || option;
    },
    // MÉTODO saveAvatar ATUALIZADO
    async saveAvatar() {
        if (!this.user) return;

        // Se o usuário já criou o avatar gratuito, pede confirmação
        if (this.user.hasCreatedAvatar) {
            const result = await Swal.fire({
                title: 'Usar um Passe?',
                text: `Você está prestes a usar 1 dos seus ${this.user.avatarPasses} passes para salvar este avatar. Deseja continuar?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim, usar passe!',
                cancelButtonText: 'Cancelar',
                background: "#1F2937",
                color: "#E5E7EB"
            });

            if (!result.isConfirmed) {
                return; // Aborta se o usuário cancelar
            }
        }
      
        try {
            // A requisição para o backend continua a mesma
            const response = await axios.put('/api/users/avatar', { avatarUrl: this.avatarUrl }, { headers: { Authorization: `Bearer ${this.token}` } });
            
            // ATUALIZA O USUÁRIO LOCAL COM OS DADOS VINDOS DO BACKEND
            this.user = response.data.user;
            localStorage.setItem("userData", JSON.stringify(this.user));
            window.dispatchEvent(new Event("storage"));

            await Swal.fire({
                title: 'Avatar Salvo!',
                text: 'Seu novo avatar foi salvo com sucesso!',
                icon: 'success',
                background: "#1F2937",
                color: "#E5E7EB",
            });

            this.$router.push('/profile');
        } catch (error) {
            Swal.fire({
                title: 'Erro ao Salvar',
                text: error.response?.data?.error || 'Não foi possível salvar seu avatar.',
                icon: 'error',
                background: "#1F2937",
                color: "#E5E7EB"
            });
        }
    },
    // ... (seus métodos de download 'downloadSVG' e 'downloadPNG' continuam iguais)
    async downloadSVG() {
        this.isDownloading = true;
        try {
            const response = await axios.get(this.proxiedAvatarUrl, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/svg+xml' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'avatar.svg');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar SVG:", error);
            Swal.fire('Erro', 'Não foi possível baixar o SVG.', 'error');
        } finally {
            this.isDownloading = false;
        }
    },
    async downloadPNG() {
        this.isDownloading = true;
        try {
            const response = await axios.get(this.proxiedAvatarUrl, { responseType: 'text' });
            const svgText = response.data;

            const canvas = document.createElement('canvas');
            canvas.width = this.pngSize;
            canvas.height = this.pngSize;
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, this.pngSize, this.pngSize);
                const pngUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = 'avatar.png';
                document.body.appendChild(link);
                link.click();
                link.remove();
                this.isDownloading = false;
            };
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            img.src = url;
        } catch (error) {
            console.error("Erro ao converter para PNG:", error);
            Swal.fire('Erro', 'Não foi possível baixar o PNG.', 'error');
            this.isDownloading = false;
        }
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.select-input {
  width: 100%; padding: 0.75rem 1rem; background-color: #374151; border: 1px solid #4B5563; border-radius: 0.5rem; color: white; -webkit-appearance: none; -moz-appearance: none; appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem;
}
.select-input option { background-color: #374151; color: #e5e7eb; }
.option-icon { width: 2rem; height: 2rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.option-icon i { color: white; font-size: 0.875rem; }
.download-button { width: 100%; font-weight: 600; padding: 0.75rem 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.download-button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>