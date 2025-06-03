<template>
  <div class="create-avatar">
    <h2><i class="fas fa-user-circle"></i> Criar seu Avatar</h2>

    <div class="content">
      <!-- Coluna Esquerda - Opções -->
      <form @submit.prevent="createAvatar" class="form-options">
        <label>
          <span class="label-icon"><i class="fas fa-user"></i></span>
          Nome:
          <input v-model="avatar.name" type="text" required placeholder="Digite seu nome" />
        </label>

        <label>
          <span class="label-icon"><i class="fas fa-cut"></i></span>
          Estilo de Cabelo:
          <select v-model="avatar.topType">
            <option v-for="option in options.topType" :key="option" :value="option">
              {{ traduzir(option) }}
            </option>
          </select>
        </label>

        <label>
          <span class="label-icon"><i class="fas fa-palette"></i></span>
          Cor do Cabelo:
          <select v-model="avatar.hairColor">
            <option v-for="option in options.hairColor" :key="option" :value="option">
              {{ traduzir(option) }}
            </option>
          </select>
        </label>

        <label>
          <span class="label-icon"><i class="fas fa-glasses"></i></span>
          Acessórios:
          <select v-model="avatar.accessoriesType">
            <option v-for="option in options.accessoriesType" :key="option" :value="option">
              {{ traduzir(option) }}
            </option>
          </select>
        </label>

        <label>
          <span class="label-icon"><i class="fas fa-tshirt"></i></span>
          Roupa:
          <select v-model="avatar.clotheType">
            <option v-for="option in options.clotheType" :key="option" :value="option">
              {{ traduzir(option) }}
            </option>
          </select>
        </label>

        <label>
          <span class="label-icon"><i class="fas fa-sun"></i></span>
          Cor da Pele:
          <select v-model="avatar.skinColor">
            <option v-for="option in options.skinColor" :key="option" :value="option">
              {{ traduzir(option) }}
            </option>
          </select>
        </label>

        <label>
          <span class="label-icon"><i class="fas fa-image"></i></span>
          Tamanho da Imagem PNG:
          <select v-model.number="pngSize">
            <option :value="200">200x200</option>
            <option :value="400">400x400</option>
            <option :value="600">600x600</option>
          </select>
        </label>

        <button type="submit"><i class="fas fa-save"></i> Salvar Avatar</button>
      </form>

      <!-- Coluna Direita - Avatar Preview -->
      <div class="avatar-preview">
        <h3><i class="fas fa-eye"></i> Visualização</h3>
        <img :src="avatarUrl" alt="Prévia do Avatar" />

        <div class="download-buttons">
          <button @click="downloadSVG"><i class="fas fa-file-code"></i> Baixar SVG</button>
          <button @click="downloadPNG"><i class="fas fa-file-image"></i> Baixar PNG</button>
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
    async downloadSVG() {
      const response = await fetch(this.avatarUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.avatar.name || 'avatar'}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    },
    async downloadPNG() {
      const response = await fetch(this.avatarUrl);
      const svgText = await response.text();

      const canvas = document.createElement('canvas');
      canvas.width = this.pngSize;
      canvas.height = this.pngSize;

      const ctx = canvas.getContext('2d');
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.pngSize, this.pngSize);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${this.avatar.name || 'avatar'}.png`;
        link.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
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

.create-avatar {
  max-width: 100%; /* Garante que o componente não ultrapasse a largura da tela */
  margin: auto;
  padding: 1.5rem; /* Reduz o espaçamento interno */
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to right, #04d1b0, #4e44e1); /* Fundo igual ao AdminProducts.vue */
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Adiciona profundidade */
}

@media (min-width: 768px) {
  .create-avatar {
    max-width: 1200px; /* Ajusta a largura para telas maiores */
  }
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem; /* Reduz o espaçamento abaixo do título */
  color: #ffffff; /* Ajuste para contraste com o fundo */
  font-size: 2rem; /* Tamanho menor para reduzir altura */
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem; /* Reduz o espaçamento entre os elementos */
  justify-content: center;
}

.form-options {
  flex: 1;
  min-width: 300px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espaçamento entre os campos */
  background-color: #1f2937; /* Fundo para separar visualmente */
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

label {
  font-weight: bold;
  display: flex;
  align-items: center; /* Alinha o texto e o ícone horizontalmente */
  font-size: 1rem;
  color: #e5e7eb;
  gap: 0.5rem; /* Espaçamento entre o ícone e o texto */
}

.label-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #04d1b0;
  color: #ffffff;
  border-radius: 50%;
  font-size: 1rem;
}

input,
select {
  margin-top: 4px;
  padding: 0.5rem; /* Reduz o espaçamento interno dos campos */
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #3b3b3b; /* Bordas mais visíveis */
  border-radius: 0.5rem;
  font-size: 0.9rem; /* Tamanho menor para reduzir altura */
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
select:focus {
  border: 2px solid #04d1b0;
  box-shadow: 0 0 8px rgba(4, 209, 176, 0.5); /* Destaque ao focar */
}

button {
  padding: 0.5rem 1rem; /* Reduz o espaçamento interno dos botões */
  background-image: linear-gradient(to right, #04d1b0, #4e44e1);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button i {
  font-size: 1rem; /* Tamanho menor para reduzir altura */
}

button:hover {
  background-image: linear-gradient(to right, #03b89a, #3e3ab8);
  transform: scale(1.05);
}

button:focus {
  outline: 2px solid #04d1b0; /* Foco visível para acessibilidade */
  outline-offset: 2px;
}

.avatar-preview {
  flex: 0.40;
  min-width: 250px;
  text-align: center; /* Centraliza o conteúdo dentro do contêiner */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1f2937; /* Fundo para separação */
  padding: 1rem; /* Reduz o espaçamento interno */
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-preview h3 {
  margin-bottom: 1rem;
  color: #e5e7eb;
  font-size: 1.3rem; /* Tamanho menor para reduzir altura */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.avatar-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 50%;
  border: 2px solid #04d1b0;
  background-color: #121212; /* Fundo escuro para contraste */
  padding: 5px;
  display: block; /* Garante que a imagem seja tratada como um bloco */
  margin: auto; /* Centraliza horizontalmente */
}

.download-buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.download-buttons button {
  padding: 0.5rem 1rem; /* Reduz o espaçamento interno dos botões */
  background-image: linear-gradient(to right, #04d1b0, #4e44e1);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.download-buttons button i {
  font-size: 1rem; /* Tamanho menor para reduzir altura */
}

.download-buttons button:hover {
  background-image: linear-gradient(to right, #03b89a, #3e3ab8);
  transform: scale(1.05);
}
</style>