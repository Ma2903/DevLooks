<template>
  <!-- 🎓 Banner de Aviso: Projeto Acadêmico -->
  <div 
    v-if="!isDismissed"
    class="academic-banner bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 border-b-2 border-yellow-400 px-4 py-3 relative"
    role="alert"
    aria-live="polite"
  >
    <div class="container mx-auto flex items-center justify-between gap-4 flex-wrap">
      <!-- Ícone e Mensagem -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0">
          <i class="fas fa-graduation-cap text-white text-2xl drop-shadow-lg"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm md:text-base text-white font-bold drop-shadow-md">
            <span class="font-extrabold">⚠️ ATENÇÃO:</span> 
            Este é um projeto acadêmico desenvolvido para fins educacionais.
            <span class="hidden md:inline">
              Pagamentos são processados via Mercado Pago em modo de produção.
            </span>
          </p>
          <p class="text-xs text-gray-100 mt-1 hidden sm:block drop-shadow">
            Desenvolvido por Manoela Pinheiro da Silva • 
            <router-link to="/project" class="text-white hover:text-yellow-200 underline font-semibold">
              Saiba mais sobre o projeto
            </router-link>
          </p>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <router-link 
          to="/terms"
          class="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all border-2 border-white/40 backdrop-blur-sm"
        >
          <i class="fas fa-file-contract mr-1"></i>
          <span class="hidden sm:inline">Ver </span>Termos
        </router-link>
        
        <button
          @click="dismissBanner"
          class="text-white hover:text-gray-200 transition-colors p-2 bg-black/20 rounded-lg hover:bg-black/30"
          aria-label="Fechar aviso"
        >
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const BANNER_KEY = 'academic-banner-dismissed';
const isDismissed = ref(false);

// Verifica se usuário já dispensou o banner (válido por 7 dias)
onMounted(() => {
  const dismissedTime = localStorage.getItem(BANNER_KEY);
  if (dismissedTime) {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
    
    if (now - parseInt(dismissedTime) < sevenDays) {
      isDismissed.value = true;
    } else {
      // Passou de 7 dias, mostra novamente
      localStorage.removeItem(BANNER_KEY);
    }
  }
});

const dismissBanner = () => {
  isDismissed.value = true;
  localStorage.setItem(BANNER_KEY, Date.now().toString());
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.academic-banner {
  /* ⚡ PERFORMANCE */
  transform: translateZ(0);
  will-change: transform;
  
  /* 🎨 Glassmorphism */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Animação de entrada */
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efeito de pulso sutil para chamar atenção */
.academic-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}
</style>
