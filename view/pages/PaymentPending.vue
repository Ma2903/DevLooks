<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-16">
    <div class="max-w-2xl w-full bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-yellow-500 p-8 text-center animate-fade-in">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-yellow-500 rounded-full mb-6 animate-pulse">
          <i class="fas fa-clock text-white text-5xl"></i>
        </div>
        <h1 class="text-4xl font-bold text-white mb-4">
          Pagamento Pendente
        </h1>
        <p class="text-xl text-gray-300 mb-2">
          Aguardando confirmação do pagamento
        </p>
        <p class="text-gray-400">
          Você receberá uma notificação quando o pagamento for confirmado
        </p>
      </div>

      <div class="bg-gray-900/50 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">O que está acontecendo?</h2>
        <ul class="text-left space-y-3 text-gray-300">
          <li class="flex items-start gap-3">
            <i class="fas fa-hourglass-half text-yellow-400 mt-1"></i>
            <span>Seu pagamento está sendo processado</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-bell text-yellow-400 mt-1"></i>
            <span>Você receberá uma notificação quando for aprovado</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-envelope text-yellow-400 mt-1"></i>
            <span>Um email de confirmação será enviado</span>
          </li>
        </ul>
      </div>

      <div class="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-8">
        <p class="text-sm text-gray-300">
          <i class="fas fa-info-circle text-blue-400 mr-2"></i>
          <strong>Pagamentos via boleto ou PIX</strong> podem levar até 3 dias úteis para confirmação
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/my-orders" 
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
        >
          <i class="fas fa-receipt mr-2"></i>
          Acompanhar Pedido
        </router-link>
        <router-link 
          to="/" 
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          <i class="fas fa-home mr-2"></i>
          Voltar ao Início
        </router-link>
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
