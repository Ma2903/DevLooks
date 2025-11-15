<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-16">
    <div class="max-w-2xl w-full bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-red-500 p-8 text-center animate-fade-in">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-full mb-6">
          <i class="fas fa-times text-white text-5xl"></i>
        </div>
        <h1 class="text-4xl font-bold text-white mb-4">
          Pagamento Não Aprovado
        </h1>
        <p class="text-xl text-gray-300 mb-2">
          Não foi possível processar seu pagamento
        </p>
        <p class="text-gray-400">
          O pagamento foi recusado ou cancelado
        </p>
      </div>

      <div class="bg-gray-900/50 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">Possíveis motivos:</h2>
        <ul class="text-left space-y-3 text-gray-300">
          <li class="flex items-start gap-3">
            <i class="fas fa-credit-card text-red-400 mt-1"></i>
            <span>Dados do cartão incorretos ou inválidos</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-ban text-red-400 mt-1"></i>
            <span>Limite insuficiente</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-shield-alt text-red-400 mt-1"></i>
            <span>Bloqueio de segurança do banco emissor</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-times-circle text-red-400 mt-1"></i>
            <span>Pagamento cancelado pelo usuário</span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/cart" 
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
        >
          <i class="fas fa-redo mr-2"></i>
          Tentar Novamente
        </router-link>
        <router-link 
          to="/" 
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          <i class="fas fa-home mr-2"></i>
          Voltar ao Início
        </router-link>
      </div>

      <div class="mt-8 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
        <p class="text-sm text-gray-400">
          <i class="fas fa-info-circle text-blue-400 mr-2"></i>
          Se precisar de ajuda, entre em contato com nosso suporte
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
