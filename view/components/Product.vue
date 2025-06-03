<template>
  <div @click="gotoPage" class="max-w-sm rounded-lg overflow-hidden shadow-lg p-4 bg-gray-900 cursor-pointer hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 border-2 border-transparent hover:border-[#04d1b0]">
    <!-- Conteúdo do card -->
    <div class="px-4 py-4">
      <h2 class="font-bold text-xl mb-2 text-[#04d1b0]">{{ product.name }}</h2>
      <p class="text-gray-300 text-sm">
        {{ product.description }}
      </p>
    </div>
    <!-- Preço e Categoria -->
    <div class="px-4 pb-4 flex justify-between items-center">
      <span class="text-lg font-semibold text-[#04d1b0]">R${{ product.price.toFixed(2) }}</span>
      <span class="bg-[#4e44e1] text-white text-xs font-medium px-3 py-1 rounded-lg">#{{ product.category }}</span>
    </div>
    <div class="px-4 pb-2">
      <span v-if="product.price >= 150" class="text-[#04d1b0] font-bold">
        Frete Grátis
      </span>
      <span v-else class="text-gray-400">
        Frete: R$ 19,90
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Product',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    gotoPage() {
      this.$router.push({ path: `/product/${this.product._id}` });
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

body {
  font-family: 'Fira Code', monospace;
}
</style>