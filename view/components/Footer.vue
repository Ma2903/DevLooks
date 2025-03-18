<template>
    <footer class="bg-gray-800 text-gray-300 py-6">
      <div class="container mx-auto text-center">
        <p class="text-sm md:text-base">
          &copy; {{ new Date().getFullYear() }} Loja de Avatares. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer",
  };
  </script>
  
  <style scoped>
  footer {
    border-top: 2px solid #444444;
  }
  </style>