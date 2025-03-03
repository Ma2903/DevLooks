<script setup>
import Header from './components/Header.vue'
import Product from './components/Product.vue';
import SearchBar from './components/Search-bar.vue';
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'

const images = import.meta.glob('@/assets/*.{jpg,jpeg}', { eager: true });

const produtos = [ 
  {
    id: 1,
    name: 'Produto 1',
    image: images['/src/assets/camisa.jpg'].default,
    price: 99.99,
    category: 'Camisetas'
  },
  {
    id: 2,
    name: 'Produto 2',
    price: 199.99,
    category: 'Camisetas'
  },
  {
    id: 3,
    name: 'Produto 3',
    price: 299.99,
    category: 'Camisetas'
  },
  {
    id: 4,
    name: 'Produto 4',
    price: 399.99,
    category: 'Camisetas'
  },
  {
    id: 5,
    name: 'Produto 5',
    image : images['/src/assets/camisa2.jpeg'].default,
    price: 499.99,
    category: 'Camisetas'
  }
]
</script>

<template>
  <Header />
  <Search-bar/>
  <main class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mx-auto max-w-screen-lg">
    <Product v-for="produto in produtos" :key="produto.id" :product="produto" />
  </main>
</template>

<style scoped>

</style>
