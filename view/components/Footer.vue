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
    <div class="mt-10 pt-6 border-t border-gray-400 dark:border-gray-700">
      <!-- Aviso Legal sobre Projeto Acadêmico -->
      <div class="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <i class="fas fa-graduation-cap text-emerald-400 text-xl mt-1"></i>
          <div class="text-sm">
            <h4 class="text-white font-semibold mb-1">📚 Projeto Acadêmico</h4>
            <p class="text-gray-300">
              Este e-commerce é parte de um <strong>projeto acadêmico</strong> para fins de prática e aprendizado. 
              Embora a API do Mercado Pago esteja integrada e funcional, este site <strong>não representa um negócio real com estoque físico</strong>. 
              Desenvolvido com Vue.js, Node.js, TypeScript, MongoDB e Gemini AI.
            </p>
            <div class="mt-2 flex flex-wrap gap-2 text-xs">
              <router-link to="/about" class="text-emerald-400 hover:text-emerald-300 underline">Sobre o Projeto</router-link>
              <span class="text-gray-400 dark:text-gray-600">•</span>
              <router-link to="/privacy" class="text-emerald-400 hover:text-emerald-300 underline">Política de Privacidade</router-link>
              <span class="text-gray-400 dark:text-gray-600">•</span>
              <router-link to="/terms" class="text-emerald-400 hover:text-emerald-300 underline">Termos de Uso</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <p class="text-center text-sm">&copy; 2025 DevLooks. Projeto Temático - Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>