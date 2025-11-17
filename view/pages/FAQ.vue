<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 py-20 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-extrabold text-white mt-4">🤔 Perguntas Frequentes (FAQ)</h1>
      </div>
      <div class="space-y-4">
        <div v-for="(item, index) in faqItems" :key="index" class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <button @click="toggleFaq(index)" class="w-full text-left p-6 flex justify-between items-center focus:outline-none transition-colors hover:bg-gray-700/50">
            <h2 class="text-xl font-bold text-white">{{ item.question }}</h2>
            <i :class="item.open ? 'fas fa-chevron-up transform rotate-180' : 'fas fa-chevron-down'" class="text-emerald-400 transition-transform duration-300"></i>
          </button>
          <div v-if="item.open" class="px-6 pb-6 text-lg leading-relaxed border-t border-emerald-500/20">
            <p class="mt-4">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const faqItems = ref([
  { 
    question: '🎟️ Como funciona a compra de Passes de Avatar?', 
    answer: 'Você pode comprar um "Passe de Avatar" como qualquer outro produto em nossa loja. Após a confirmação do pagamento, o passe é creditado automaticamente na sua conta e você pode usá-lo na página "Criar Avatar" para salvar uma nova criação.', 
    open: false 
  },
  { 
    question: '💳 Quais são as formas de pagamento?', 
    answer: 'Aceitamos PIX, boleto bancário e cartões de crédito das principais bandeiras. Todo o processo de pagamento é seguro e criptografado.', 
    open: false 
  },
  { 
    question: '🚚 Como acompanho meu pedido?', 
    answer: 'Após fazer login, você pode acessar a página "Minhas Compras" no menu do seu perfil. Lá você encontrará o histórico de todos os seus pedidos e o status atual de cada um.', 
    open: false 
  },
  { 
    question: '💸 Posso usar um cupom mais de uma vez?', 
    answer: 'Depende do cupom. Cupons promocionais geralmente podem ser usados várias vezes, mas cupons especiais, como o PRIMEIRACOMPRA10%, são de uso único por usuário.', 
    open: false 
  }
]);

function toggleFaq(index) {
  faqItems.value[index].open = !faqItems.value[index].open;
}
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>