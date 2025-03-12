<template>
    <div class="bg-gray-900 min-h-screen font-mono text-gray-200">
      <main class="container mx-auto py-16 px-6">
        <h1 class="text-5xl font-semibold mb-8 text-purple-400 text-center">
          <i class="fas fa-user-astronaut mr-2"></i>Criar e Editar Avatar
        </h1>
        <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
          <form @submit.prevent="createAvatar">
            <div class="mb-4">
              <label for="avatarName" class="block text-lg font-medium text-gray-300">Nome do Avatar</label>
              <input type="text" id="avatarName" v-model="avatarName" class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div class="mb-4">
              <label for="avatarColor" class="block text-lg font-medium text-gray-300">Cor da Pele</label>
              <input type="color" id="avatarColor" v-model="avatarColor" class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white">
            </div>
            <div class="mb-4">
              <label for="eyeColor" class="block text-lg font-medium text-gray-300">Cor dos Olhos</label>
              <input type="color" id="eyeColor" v-model="eyeColor" class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white">
            </div>
            <div class="mb-4">
              <label for="hairStyle" class="block text-lg font-medium text-gray-300">Estilo de Cabelo</label>
              <select id="hairStyle" v-model="hairStyle" class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white">
                <option value="none">Nenhum</option>
                <option value="short">Curto</option>
                <option value="long">Longo</option>
                <option value="curly">Cacheado</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="avatarAccessory" class="block text-lg font-medium text-gray-300">Acessório</label>
              <select id="avatarAccessory" v-model="avatarAccessory" class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white">
                <option value="none">Nenhum</option>
                <option value="hat">Chapéu</option>
                <option value="glasses">Óculos</option>
              </select>
            </div>
            <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              <i class="fas fa-save mr-2"></i>Salvar Avatar
            </button>
          </form>
          <div class="mt-8 text-center">
            <h2 class="text-3xl font-semibold mb-4 text-purple-400">Pré-visualização do Avatar</h2>
            <canvas ref="avatarCanvas" width="200" height="200" class="bg-gray-700 rounded-full"></canvas>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        avatarName: '',
        avatarColor: '#ffcc99',
        eyeColor: '#000000',
        hairStyle: 'none',
        avatarAccessory: 'none',
      };
    },
    methods: {
      createAvatar() {
        console.log('Avatar criado:', this.avatarName);
      },
      drawAvatar() {
        const canvas = this.$refs.avatarCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Cabeça
        ctx.fillStyle = this.avatarColor;
        ctx.beginPath();
        ctx.arc(100, 100, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // Olhos
        ctx.fillStyle = this.eyeColor;
        ctx.beginPath();
        ctx.arc(80, 90, 8, 0, Math.PI * 2);
        ctx.arc(120, 90, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Boca
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(100, 120, 20, 0, Math.PI);
        ctx.stroke();
        
        // Cabelo
        ctx.fillStyle = "#3a2a1a";
        if (this.hairStyle === "short") {
          ctx.fillRect(60, 40, 80, 40);
        } else if (this.hairStyle === "long") {
          ctx.fillRect(50, 40, 100, 80);
        } else if (this.hairStyle === "curly") {
          for (let i = 50; i < 150; i += 15) {
            ctx.beginPath();
            ctx.arc(i, 50, 10, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Acessórios
        ctx.fillStyle = "black";
        if (this.avatarAccessory === "glasses") {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          ctx.strokeRect(65, 80, 30, 15);
          ctx.strokeRect(105, 80, 30, 15);
        } else if (this.avatarAccessory === "hat") {
          ctx.fillRect(60, 30, 80, 20);
          ctx.fillRect(40, 50, 120, 10);
        }
      }
    },
    watch: {
      avatarColor() { this.drawAvatar(); },
      eyeColor() { this.drawAvatar(); },
      hairStyle() { this.drawAvatar(); },
      avatarAccessory() { this.drawAvatar(); }
    },
    mounted() {
      this.drawAvatar();
    }
  };
  </script>  