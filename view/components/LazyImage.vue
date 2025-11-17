<template>
  <img
    :data-src="src"
    :alt="alt"
    :class="imgClass"
    :width="width"
    :height="height"
    class="lazy-image"
    ref="imgRef"
    loading="lazy"
    decoding="async"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Imagem do produto'
  },
  imgClass: {
    type: String,
    default: ''
  },
  // 🎯 PERFORMANCE: width/height evitam CLS (Cumulative Layout Shift)
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  }
});

const imgRef = ref(null);
let observer = null;

onMounted(() => {
  // ⚡ PERFORMANCE: Intersection Observer para lazy loading otimizado
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          // Carrega a imagem
          img.src = src;
          img.classList.add('loaded');
          
          // Para de observar após carregar (libera memória)
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px', // Carrega 50px antes de aparecer
    threshold: 0.01 // Trigger quando 1% visível
  });

  if (imgRef.value) {
    observer.observe(imgRef.value);
  }
});

onUnmounted(() => {
  if (observer && imgRef.value) {
    observer.unobserve(imgRef.value);
  }
  // Limpa o observer completamente
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.lazy-image {
  /* 🎯 PERFORMANCE: Evita reflow com transform em vez de opacity */
  opacity: 0;
  transform: translateZ(0); /* Hardware acceleration */
  transition: opacity 0.3s ease-in-out;
  background: linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.lazy-image.loaded {
  opacity: 1;
  animation: none;
  background: transparent;
}

/* Animação de skeleton enquanto carrega */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
