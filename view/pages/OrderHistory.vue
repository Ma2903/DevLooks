<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8 text-white">Histórico de Compras</h1>
      <div v-if="loading" class="text-center">
        <p class="text-lg">Carregando histórico...</p>
      </div>
      <div v-else-if="orders.length === 0" class="text-center bg-gray-800 p-8 rounded-lg">
        <p class="text-lg">Você ainda não fez nenhuma compra.</p>
      </div>
      <div v-else>
        <div v-for="order in orders" :key="order._id" class="bg-gray-800 rounded-lg shadow-lg mb-6 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-[#04d1b0]">Pedido #{{ order._id }}</h2>
            <p class="text-gray-400">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>
          <div>
            <ul>
              <li v-for="item in order.items" :key="item._id" class="flex items-center justify-between py-2 border-b border-gray-700">
                <div class="flex items-center">
                  <img :src="getImageUrl(item.image)" :alt="item.name" class="w-16 h-16 object-cover rounded-md mr-4">
                  <div>
                    <p class="font-semibold">{{ item.name }}</p>
                    <p class="text-sm text-gray-400">{{ item.quantity }} x R$ {{ item.price.toFixed(2) }}</p>
                  </div>
                </div>
                <p class="font-semibold">R$ {{ (item.quantity * item.price).toFixed(2) }}</p>
              </li>
            </ul>
          </div>
          <div class="text-right mt-4">
            <p class="text-lg font-bold">Total: <span class="text-[#04d1b0]">R$ {{ order.total.toFixed(2) }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/orders/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  },
};
</script>