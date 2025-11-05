<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-10 text-white flex items-center justify-center gap-3">
        <i class="fas fa-receipt text-[#04d1b0]"></i>
        Histórico de Compras
      </h1>
      <div v-if="loading" class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-3xl text-[#04d1b0]"></i>
        <p class="mt-2">Carregando seu histórico...</p>
      </div>
      <div v-else-if="orders.length === 0" class="text-center bg-gray-800 p-8 rounded-lg shadow-lg">
        <p class="text-xl"><i class="fas fa-ghost mr-2"></i>Você ainda não fez nenhuma compra.</p>
      </div>
      <div v-else>
        <div v-for="order in orders" :key="order._id" class="bg-gray-800 rounded-lg shadow-lg mb-6 p-6 border-l-4 border-[#04d1b0]">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 class="text-xl font-bold text-[#04d1b0]">Pedido #{{ order._id.slice(-6) }}</h2>
              <p class="text-gray-400 text-sm">{{ new Date(order.createdAt).toLocaleDateString('pt-BR') }}</p>
            </div>
            <span :class="getStatusClass(order.status || 'Processando')" class="px-3 py-1 mt-2 sm:mt-0 rounded-full text-sm font-bold">
              {{ order.status || 'Processando' }}
            </span>
          </div>
          <div>
            <ul>
              <li v-for="item in order.items" :key="item.productId" class="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div class="flex items-center">
                  <img :src="getImageUrl(item.image)" :alt="item.name" class="w-16 h-16 object-cover rounded-md mr-4 border-2 border-gray-700">
                  <div>
                    <p class="font-semibold text-white">{{ item.name }}</p>
                    <p class="text-sm text-gray-400">{{ item.quantity }} x R$ {{ item.price ? item.price.toFixed(2) : '0.00' }}</p>
                  </div>
                </div>
                <p class="font-semibold text-gray-300">R$ {{ item.price && item.quantity ? (item.quantity * item.price).toFixed(2) : '0.00' }}</p>
              </li>
            </ul>
          </div>
          <div class="text-right mt-4 border-t border-gray-700 pt-4">
            <p class="text-lg font-bold">Total do Pedido: <span class="text-[#04d1b0] text-xl">R$ {{ order.total ? order.total.toFixed(2) : 'N/A' }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// --- CORREÇÃO DE IMPORTAÇÃO ---
import api from '@/services/main.js';

export default {
  name: 'OrderHistory',
  data() {
    return {
      orders: [],
      loading: true,
    };
  },
  async created() {
    await this.fetchOrderHistory();
  },
  methods: {
    async fetchOrderHistory() {
      this.loading = true;
      try {
        // --- CORREÇÃO NA CHAMADA API ---
        // Usa a instância 'api' que já tem o interceptor de token
        const response = await api.get('/api/orders/history');
        this.orders = response.data;
      } catch (error) {
        console.error('Erro ao buscar o histórico de pedidos:', error);
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      const cleanPath = imagePath.replace(/^public[\\/]/, '');
      return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
    getStatusClass(status) {
      switch (status) {
        case 'Processando': return 'bg-orange-500/30 text-orange-400 border border-orange-500/50';
        case 'Enviado': return 'bg-blue-500/30 text-blue-400 border border-blue-500/50';
        case 'Entregue': return 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50';
        case 'Cancelado': return 'bg-red-500/30 text-red-400 border border-red-500/50';
        default: return 'bg-gray-500/30 text-gray-400 border border-gray-500/50';
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>