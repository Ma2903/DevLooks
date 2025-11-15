<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-16">
    <div class="max-w-2xl w-full bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-green-500 p-8 text-center animate-fade-in">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce">
          <i class="fas fa-check text-white text-5xl"></i>
        </div>
        <h1 class="text-4xl font-bold text-white mb-4">
          Pagamento Aprovado! 🎉
        </h1>
        <p class="text-xl text-gray-300 mb-2">
          Seu pedido foi confirmado com sucesso
        </p>
        <p class="text-gray-400">
          Você receberá um email com os detalhes do seu pedido
        </p>
      </div>

      <div class="bg-gray-900/50 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">Próximos passos:</h2>
        <ul class="text-left space-y-3 text-gray-300">
          <li class="flex items-start gap-3">
            <i class="fas fa-envelope text-green-500 mt-1"></i>
            <span>Você receberá um email de confirmação</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-box text-green-500 mt-1"></i>
            <span>Seu pedido está sendo preparado</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-truck text-green-500 mt-1"></i>
            <span>Acompanhe o status na página "Minhas Compras"</span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/my-orders" 
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
        >
          <i class="fas fa-receipt mr-2"></i>
          Ver Meus Pedidos
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
import { onMounted } from 'vue';

onMounted(() => {
  // Limpa os dados do checkout
  localStorage.removeItem('checkoutData');
  
  // Dispara evento para atualizar o carrinho no header
  window.dispatchEvent(new Event('cart-updated'));
});
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
