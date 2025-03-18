<script setup>
import { ref } from 'vue';
import Home from './components/Home.vue';
import CreateAvatar from './components/CreateAvatar.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const currentPage = ref('home');

const navigateTo = (page) => {
  currentPage.value = page;
};
</script>

<template>
  <div>
    <Header @navigate="navigateTo" />
    <main class="mt-0">
      <component
        :is="currentPage === 'home' ? Home : CreateAvatar"
        @navigate="navigateTo"
      />
    </main>
    <Footer />
  </div>
</template>