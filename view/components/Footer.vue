<template>
  <footer class="bg-gray-800 text-gray-400 py-12 px-4 border-t-2 border-emerald-500/20">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <div class="md:col-span-2">
        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <img src="@/assets/Logo.png" alt="DevLooks Logo" class="h-8">
          DevLooks
        </h3>
        <p class="pr-4">
          O e-commerce feito para devs. Encontre produtos que celebram a cultura da tecnologia, desde camisetas com piadas de código até acessórios que completam seu setup.
        </p>
      </div>

      <div>
        <h3 class="text-lg font-bold text-white mb-4">Institucional</h3>
        <ul class="space-y-2">
          <li><router-link to="/about" class="hover:text-emerald-400 transition-colors">Sobre Nós</router-link></li>
          <li><router-link to="/faq" class="hover:text-emerald-400 transition-colors">Perguntas Frequentes (FAQ)</router-link></li>
          <li><router-link to="/products" class="hover:text-emerald-400 transition-colors">Todos os Produtos</router-link></li>
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-bold text-white mb-4">Siga-nos</h3>
        <div class="flex space-x-4">
          <a href="#" class="text-2xl hover:text-emerald-400 transition-colors"><i class="fab fa-github"></i></a>
          <a href="#" class="text-2xl hover:text-emerald-400 transition-colors"><i class="fab fa-linkedin"></i></a>
          <a href="#" class="text-2xl hover:text-emerald-400 transition-colors"><i class="fab fa-instagram"></i></a>
        </div>
      </div>

    </div>
    <div class="mt-10 pt-6 border-t border-gray-700 text-center text-sm">
      <p>&copy; 2025 DevLooks. Todos os direitos reservados. Projeto Temático.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>