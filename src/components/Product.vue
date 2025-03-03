<template>
    <div class="max-w-sm rounded-lg overflow-hidden shadow-lg p-4 bg-white cursor-pointer hover:bg-gray-200">
      <!-- Imagem quadrada -->
      <div class="w-full h-64 flex items-center justify-center overflow-hidden bg-gray-200 rounded-lg">
        <img class="object-cover w-full h-full" :src="getImageUrl(product.image)" :alt="product.name">
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
  import images from '@/assets/images.js';
  
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
      }
    }
  }
  </script>
  
  <style scoped>
  </style>