<template>
  <div @click="gotoPage" class="max-w-sm rounded-lg overflow-hidden shadow-lg p-4 bg-white cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105">
    <!-- Imagem quadrada -->
    <div class="w-full h-64 flex items-center justify-center overflow-hidden bg-gray-200 rounded-lg">
      <img class="object-cover w-full h-full" src="/camisa.jpg" :alt="product.name">
    </div>
    
    <!-- Conteúdo do card -->
    <div class="px-4 py-4">
      <h2 class="font-bold text-xl mb-2 text-gray-900">{{ product.name }}</h2>
      <p class="text-gray-700 text-sm">
        {{ product.description }}
      </p>
    </div>
    
    <!-- Preço e Categoria -->
    <div class="px-4 pb-4 flex justify-between items-center">
      <span class="text-lg font-semibold text-green-600">R${{ product.price | currency }}</span>
      <span class="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-lg">#{{ product.category }}</span>
    </div>
  </div>
</template>

<script>
// import images from '@/assets/images.js';

export default {
  name: 'Product',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    getImageUrl(imageName) {
      const image = images[`./${imageName}`];
      return image ? image.default : '';
    },
    gotoPage() {
      this.$router.push({ path: `/product/${this.product._id}` });
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.max-w-sm {
  max-width: 20rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.overflow-hidden {
  overflow: hidden;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.p-4 {
  padding: 1rem;
}

.bg-white {
  background-color: #ffffff;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-gray-200:hover {
  background-color: #edf2f7;
}

.transition {
  transition: all 0.3s ease-in-out;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: ease-in-out;
}

.transform {
  transform: scale(1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.w-full {
  width: 100%;
}

.h-64 {
  height: 16rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.bg-gray-200 {
  background-color: #edf2f7;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.object-cover {
  object-fit: cover;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.font-bold {
  font-weight: 700;
}

.text-xl {
  font-size: 1.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-gray-900 {
  color: #1a202c;
}

.text-gray-700 {
  color: #4a5568;
}

.text-sm {
  font-size: 0.875rem;
}

.pb-4 {
  padding-bottom: 1rem;
}

.justify-between {
  justify-content: space-between;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}

.text-green-600 {
  color: #38a169;
}

.bg-gray-200 {
  background-color: #edf2f7;
}

.text-gray-700 {
  color: #4a5568;
}

.text-xs {
  font-size: 0.75rem;
}

.font-medium {
  font-weight: 500;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}
</style>