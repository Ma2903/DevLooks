<template>
  <img
    :data-src="src"
    :alt="alt"
    :class="imgClass"
    class="lazy-image"
    ref="imgRef"
    :style="{ backgroundColor: '#1f2937' }"
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
  }
});

const imgRef = ref(null);
let observer = null;

onMounted(() => {
  // Intersection Observer para lazy loading
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px' // Carrega imagem 50px antes de aparecer na tela
  });

  if (imgRef.value) {
    observer.observe(imgRef.value);
  }
});

onUnmounted(() => {
  if (observer && imgRef.value) {
    observer.unobserve(imgRef.value);
  }
});
</script>

<style scoped>
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image.loaded {
  opacity: 1;
}
</style>
