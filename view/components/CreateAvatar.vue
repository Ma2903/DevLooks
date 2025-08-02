<template>
  <div class="bg-gray-900 min-h-screen text-gray-200 py-8 px-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-[#04d1b0] mb-4 flex items-center justify-center gap-3">
          <i class="fas fa-user-circle"></i>
          Criar seu Avatar
        </h1>
        <p class="text-gray-400 text-lg">Personalize seu avatar com diferentes estilos e características</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Coluna Esquerda - Opções -->
        <div class="lg:col-span-2">
          <form @submit.prevent="createAvatar" class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <i class="fas fa-cog text-[#04d1b0]"></i>
              Personalização
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nome -->
              <div class="md:col-span-2">
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-[#04d1b0] rounded-full flex items-center justify-center">
                      <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    Nome do Avatar
                  </div>
                  <input 
                    v-model="avatar.name" 
                    type="text" 
                    required 
                    placeholder="Digite seu nome" 
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  />
                </label>
              </div>

              <!-- Estilo de Cabelo -->
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-[#4e44e1] rounded-full flex items-center justify-center">
                      <i class="fas fa-cut text-white text-sm"></i>
                    </div>
                    Estilo de Cabelo
                  </div>
                  <select 
                    v-model="avatar.topType"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  >
                    <option v-for="option in options.topType" :key="option" :value="option" class="bg-gray-700 text-white">
                      {{ traduzir(option) }}
                    </option>
                  </select>
                </label>
              </div>

              <!-- Cor do Cabelo -->
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <i class="fas fa-palette text-white text-sm"></i>
                    </div>
                    Cor do Cabelo
                  </div>
                  <select 
                    v-model="avatar.hairColor"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  >
                    <option v-for="option in options.hairColor" :key="option" :value="option" class="bg-gray-700 text-white">
                      {{ traduzir(option) }}
                    </option>
                  </select>
                </label>
              </div>

              <!-- Acessórios -->
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <i class="fas fa-glasses text-white text-sm"></i>
                    </div>
                    Acessórios
                  </div>
                  <select 
                    v-model="avatar.accessoriesType"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  >
                    <option v-for="option in options.accessoriesType" :key="option" :value="option" class="bg-gray-700 text-white">
                      {{ traduzir(option) }}
                    </option>
                  </select>
                </label>
              </div>

              <!-- Roupa -->
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <i class="fas fa-tshirt text-white text-sm"></i>
                    </div>
                    Roupa
                  </div>
                  <select 
                    v-model="avatar.clotheType"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  >
                    <option v-for="option in options.clotheType" :key="option" :value="option" class="bg-gray-700 text-white">
                      {{ traduzir(option) }}
                    </option>
                  </select>
                </label>
              </div>

              <!-- Cor da Pele -->
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <i class="fas fa-sun text-white text-sm"></i>
                    </div>
                    Cor da Pele
                  </div>
                  <select 
                    v-model="avatar.skinColor"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  >
                    <option v-for="option in options.skinColor" :key="option" :value="option" class="bg-gray-700 text-white">
                      {{ traduzir(option) }}
                    </option>
                  </select>
                </label>
              </div>

              <!-- Tamanho PNG -->
              <div>
                <label class="block text-white font-semibold mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <i class="fas fa-image text-white text-sm"></i>
                    </div>
                    Tamanho PNG
                  </div>
                  <select 
                    v-model.number="pngSize"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#04d1b0] focus:border-transparent transition-all duration-300"
                  >
                    <option :value="200" class="bg-gray-700 text-white">200x200</option>
                    <option :value="400" class="bg-gray-700 text-white">400x400</option>
                    <option :value="600" class="bg-gray-700 text-white">600x600</option>
                  </select>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full mt-8 bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-3"
            >
              <i class="fas fa-save text-xl"></i>
              Salvar Avatar
            </button>
          </form>
        </div>

        <!-- Coluna Direita - Avatar Preview -->
        <div class="lg:col-span-1">
          <div class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 sticky top-8">
            <h3 class="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <i class="fas fa-eye text-[#04d1b0]"></i>
              Visualização
            </h3>
            
            <div class="flex flex-col items-center">
              <div class="relative mb-6">
                <img 
                  :src="avatarUrl" 
                  alt="Prévia do Avatar" 
                  class="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-[#04d1b0] shadow-2xl bg-gray-700 p-2 transition-transform duration-300 hover:scale-105"
                />
                <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-800">
                  <i class="fas fa-check text-white"></i>
                </div>
              </div>

              <div class="w-full space-y-3">
                <button 
                  @click="downloadSVG"
                  :disabled="isDownloading"
                  class="w-full bg-[#4e44e1] hover:bg-[#3e3ab8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  <i v-if="!isDownloading" class="fas fa-file-code"></i>
                  <i v-else class="fas fa-spinner fa-spin"></i>
                  {{ isDownloading ? 'Baixando...' : 'Baixar SVG' }}
                </button>
                
                <button 
                  @click="downloadPNG"
                  :disabled="isDownloading"
                  class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2"
                >
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
  </div>
</template>

<script>
export default {
  name: 'CreateAvatar',
  data() {
    return {
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
  methods: {
    createAvatar() {
      alert(`Avatar "${this.avatar.name}" criado!`);
    },
    downloadSVG() {
      if (this.isDownloading) return;
      
      this.isDownloading = true;
      
      // Usar sempre o método com fetch para garantir download
      this.fetchAndDownloadSVG();
    },
    
    async fetchAndDownloadSVG() {
      try {
        console.log('Iniciando download SVG...');
        
        // Usar proxy para contornar CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(this.avatarUrl)}`;
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const svgContent = await response.text();
        
        // Criar blob com o conteúdo SVG
        const blob = new Blob([svgContent], { 
          type: 'image/svg+xml;charset=utf-8' 
        });
        
        // Criar URL temporária para o blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Criar link de download invisível
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = `${this.avatar.name || 'avatar'}.svg`;
        downloadLink.style.display = 'none';
        
        // Adicionar ao DOM, clicar e remover
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Limpar URL do blob
        URL.revokeObjectURL(blobUrl);
        
        console.log('Download SVG concluído com sucesso!');
        this.isDownloading = false;
        
      } catch (error) {
        console.error('Erro no download SVG:', error);
        this.isDownloading = false;
        
        // Se falhar, tentar método alternativo
        this.fallbackSVGDownload();
      }
    },
    
    fallbackSVGDownload() {
      try {
        // Método alternativo: criar SVG manualmente
        console.log('Tentando método alternativo...');
        
        // Criar uma imagem temporária para capturar o SVG
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            // Criar SVG string manualmente
            const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="264" height="280" viewBox="0 0 264 280" xmlns="http://www.w3.org/2000/svg">
  <image href="${this.avatarUrl}" width="264" height="280"/>
</svg>`;
            
            const blob = new Blob([svgString], { 
              type: 'image/svg+xml;charset=utf-8' 
            });
            
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.avatar.name || 'avatar'}.svg`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            console.log('Download SVG alternativo concluído!');
            this.isDownloading = false;
            
          } catch (error) {
            console.error('Erro no método alternativo:', error);
            this.isDownloading = false;
            this.showDownloadError();
          }
        };
        
        img.onerror = () => {
          console.error('Erro ao carregar imagem para método alternativo');
          this.isDownloading = false;
          this.showDownloadError();
        };
        
        // Carregar imagem
        img.src = this.avatarUrl;
        
      } catch (error) {
        console.error('Erro no fallback:', error);
        this.isDownloading = false;
        this.showDownloadError();
      }
    },
    
    showDownloadError() {
      alert('Não foi possível fazer o download automático do SVG.\n\nTente usar o botão "Baixar PNG" que funciona melhor, ou:\n1. Clique com botão direito na imagem do avatar\n2. Selecione "Salvar imagem como..."\n3. Escolha o nome e local para salvar');
    },
    downloadPNG() {
      if (this.isDownloading) return;
      
      this.isDownloading = true;
      
      try {
        console.log('Iniciando download PNG...');
        
        // Usar proxy para contornar CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(this.avatarUrl)}`;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = this.pngSize;
            canvas.height = this.pngSize;
            
            const ctx = canvas.getContext('2d');
            
            // Fundo branco para melhor contraste
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, this.pngSize, this.pngSize);
            
            // Desenhar o avatar
            ctx.drawImage(img, 0, 0, this.pngSize, this.pngSize);
            
            // Converter para PNG e fazer download
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${this.avatar.name || 'avatar'}.png`;
                link.style.display = 'none';
                
                // Garantir que não abre nova aba
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
                console.log('Download PNG concluído com sucesso!');
              } else {
                console.error('Erro ao criar blob PNG');
                this.showPNGError();
              }
              this.isDownloading = false;
            }, 'image/png', 1.0);
            
          } catch (canvasError) {
            console.error('Erro no canvas:', canvasError);
            this.isDownloading = false;
            this.showPNGError();
          }
        };
        
        img.onerror = () => {
          console.log('Erro ao carregar imagem para PNG');
          this.isDownloading = false;
          this.showPNGError();
        };
        
        // Tentar carregar a imagem
        img.src = proxyUrl;
        
      } catch (error) {
        console.error('Erro geral no download PNG:', error);
        this.isDownloading = false;
        this.showPNGError();
      }
    },
    
    showPNGError() {
      alert('Não foi possível fazer o download automático do PNG.\n\nPor favor:\n1. Clique com botão direito na imagem do avatar\n2. Selecione "Salvar imagem como..."\n3. Escolha o nome e local para salvar');
    },
    traduzir(valor) {
      const mapa = {
        NoHair: 'Sem cabelo',
        Hat: 'Chapéu',
        Hijab: 'Hijab',
        ShortHairShortFlat: 'Cabelo curto',
        LongHairStraight: 'Cabelo longo',
        Auburn: 'Ruivo escuro',
        Black: 'Preto',
        Blonde: 'Loiro',
        Brown: 'Castanho',
        Red: 'Ruivo',
        SilverGray: 'Grisalho',
        Blank: 'Nenhum',
        Kurt: 'Óculos Kurt',
        Prescription01: 'Óculos grau 1',
        Sunglasses: 'Óculos escuros',
        BlazerShirt: 'Blazer e camisa',
        BlazerSweater: 'Blazer e suéter',
        Hoodie: 'Moletom',
        ShirtCrewNeck: 'Camisa gola careca',
        Tanned: 'Bronzeado',
        Yellow: 'Amarelo',
        Pale: 'Pálido',
        Light: 'Claro',
        DarkBrown: 'Castanho escuro',
        Black: 'Preto'
      };
      return mapa[valor] || valor;
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

/* Estilos customizados para select options */
select option {
  background-color: #374151;
  color: #e5e7eb;
}

/* Transições suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
button:hover {
  transform: translateY(-1px);
}

img:hover {
  transform: scale(1.05);
}
</style>