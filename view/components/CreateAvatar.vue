<template>
  <div class="bg-gray-900 min-h-screen font-mono text-gray-200">
    <main class="container mx-auto py-16 px-6">
      <h1 class="text-5xl font-semibold mb-8 text-purple-400 text-center">
        <i class="fas fa-user-astronaut mr-2"></i>Criar e Editar Avatar
      </h1>
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Canvas para o Avatar -->
        <div class="flex-1 flex justify-center items-center">
          <canvas
            id="avatarCanvas"
            class="bg-gray-800 rounded-lg shadow-lg"
            width="300"
            height="300"
          ></canvas>
        </div>

        <!-- Controles de Personalização -->
        <div class="flex-1 bg-gray-800 p-8 rounded-lg shadow-lg">
          <form>
            <div class="mb-4">
              <label for="skinColor" class="block text-lg font-medium text-gray-300">Cor da Pele</label>
              <input
                type="color"
                id="skinColor"
                v-model="skinColor"
                class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div class="mb-4">
              <label for="eyeColor" class="block text-lg font-medium text-gray-300">Cor dos Olhos</label>
              <input
                type="color"
                id="eyeColor"
                v-model="eyeColor"
                class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div class="mb-4">
              <label for="mouthColor" class="block text-lg font-medium text-gray-300">Cor da Boca</label>
              <input
                type="color"
                id="mouthColor"
                v-model="mouthColor"
                class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div class="mb-4">
              <label for="hairStyle" class="block text-lg font-medium text-gray-300">Estilo do Cabelo</label>
              <select
                id="hairStyle"
                v-model="hairStyle"
                class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white"
              >
                <option value="short">Curto</option>
                <option value="long">Longo</option>
                <option value="bald">Careca</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="hairColor" class="block text-lg font-medium text-gray-300">Cor do Cabelo</label>
              <input
                type="color"
                id="hairColor"
                v-model="hairColor"
                class="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

export default {
  setup() {
    const skinColor = ref("#f5c6a5");
    const eyeColor = ref("#000000");
    const mouthColor = ref("#ff4d4d");
    const hairStyle = ref("short");
    const hairColor = ref("#000000");

    const drawAvatar = () => {
      const canvas = document.getElementById("avatarCanvas");
      const ctx = canvas.getContext("2d");

      // Limpar o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhar a cabeça
      ctx.fillStyle = skinColor.value;
      ctx.beginPath();
      ctx.arc(150, 150, 100, 0, Math.PI * 2);
      ctx.fill();

      // Desenhar os olhos
      ctx.fillStyle = eyeColor.value;
      ctx.beginPath();
      ctx.arc(110, 130, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(190, 130, 10, 0, Math.PI * 2);
      ctx.fill();

      // Desenhar a boca
      ctx.fillStyle = mouthColor.value;
      ctx.beginPath();
      ctx.arc(150, 190, 30, 0, Math.PI);
      ctx.fill();

      // Desenhar o cabelo
     // Desenhar o cabelo
ctx.fillStyle = hairColor.value;
if (hairStyle.value === "short") {
  // Cabelo curto formado por muitos fios
  ctx.strokeStyle = hairColor.value;
  ctx.lineWidth = 1;

  // Desenhar fios ao longo da posição do arco
  const centerX = 150; // Centro do arco no eixo X
  const centerY = 90; // Centro do arco no eixo Y
  const radius = 100; // Raio do arco
  const startAngle = Math.PI; // Ângulo inicial do arco
  const endAngle = 2 * Math.PI; // Ângulo final do arco
  const numFios = 10000; // Número de fios de cabelo (aumentado para mais densidade)

  for (let i = 0; i < numFios; i++) {
    // Calcular o ângulo para cada fio
    const angle = startAngle + (i / numFios) * (endAngle - startAngle);

    // Calcular as posições inicial e final do fio
    const startX = centerX + radius * Math.cos(angle);
    const startY = centerY + radius * Math.sin(angle);
    const controlX = centerX + (Math.random() - 0.5) * 50; // Ponto de controle aleatório no eixo X
    const controlY = centerY - Math.random() * 20; // Ponto de controle aleatório no eixo Y
    const endX = startX + (Math.random() - 0.5) * 60; // Posição final aleatória no eixo X
    const endY = startY + Math.random() * 40; // Posição final aleatória no eixo Y

    // Desenhar o fio
    ctx.beginPath();
    ctx.moveTo(startX, startY); // Ponto inicial do fio
    ctx.quadraticCurveTo(controlX, controlY, endX, endY); // Curva do fio
    ctx.stroke();
  }
} else if (hairStyle.value === "long") {
  // Cabelo longo
  ctx.beginPath();
  ctx.arc(150, 80, 70, Math.PI, 2 * Math.PI); // Parte superior do cabelo
  ctx.fill();
  ctx.fillRect(80, 100, 140, 120); // Parte inferior do cabelo longo
}
    else if (hairStyle.value === "long") {
        // Cabelo longo
        ctx.beginPath();
        ctx.arc(150, 80, 70, Math.PI, 2 * Math.PI); // Parte superior do cabelo
        ctx.fill();
        ctx.fillRect(80, 100, 140, 120); // Parte inferior do cabelo longo
      } else if (hairStyle.value === "bald") {
        // Careca (não desenha cabelo)
      }
    };

    onMounted(() => {
      drawAvatar(); // Desenhar avatar inicial
    });

    // Atualizar o avatar automaticamente ao modificar as opções
    watch([skinColor, eyeColor, mouthColor, hairStyle, hairColor], drawAvatar);

    return {
      skinColor,
      eyeColor,
      mouthColor,
      hairStyle,
      hairColor,
    };
  },
};
</script>

<style scoped>
canvas {
  border: 2px solid #4a5568;
}
</style>