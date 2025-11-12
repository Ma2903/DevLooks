<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-emerald-400 flex items-center gap-3">
          <i class="fas fa-dollar-sign"></i>
          Gerenciamento de Vendas
        </h1>
        <div class="flex items-center gap-4 mt-4 md:mt-0">
          <button @click="exportData('json')"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
            <i class="fas fa-file-code"></i> Exportar JSON
          </button>
          <button @click="exportData('csv')"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
            <i class="fas fa-file-csv"></i> Exportar CSV
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center p-10">
        <i class="fas fa-spinner fa-spin text-3xl text-emerald-400"></i>
        <p class="mt-4">Carregando pedidos...</p>
      </div>

      <div v-else-if="allOrders.length === 0" class="text-center bg-gray-800 p-8 rounded-lg">
        <i class="fas fa-ghost text-4xl text-gray-500 mb-3"></i>
        <p class="text-xl">Nenhuma venda encontrada.</p>
      </div>

      <div v-else class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gradient-to-r from-emerald-600 to-cyan-600">
            <tr>
              <th class="p-4 uppercase text-sm font-semibold">ID do Pedido</th>
              <th class="p-4 uppercase text-sm font-semibold">Cliente</th>
              <th class="p-4 uppercase text-sm font-semibold">Data</th>
              <th class="p-4 uppercase text-sm font-semibold">Total</th>
              <th class="p-4 uppercase text-sm font-semibold">Status</th>
              <th class="p-4 uppercase text-sm font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order._id" class="border-b border-gray-700 hover:bg-gray-700/50 transition-all">
              <td class="p-4 font-mono text-xs text-gray-400">{{ order._id }}</td>
              <td class="p-4">
                <div class="font-medium">{{ order.user ? order.user.name : 'Usuário Removido' }}</div>
                <div class="text-xs text-gray-400">{{ order.user ? order.user.email : '' }}</div>
              </td>
              <td class="p-4">{{ new Date(order.createdAt).toLocaleDateString('pt-BR') }}</td>
              <td class="p-4 font-bold text-green-400">R$ {{ order.total.toFixed(2) }}</td>
              <td class="p-4">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold">
                  {{ order.status }}
                </span>
              </td>
              <td class="p-4 flex justify-center items-center gap-3">
                <button @click="updateStatus(order)" class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <i class="fas fa-edit"></i> Mudar Status
                </button>
                <button @click="confirmDelete(order)" class="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  <i class="fas fa-trash-alt"></i> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Controles de Paginação -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <i class="fas fa-arrow-left"></i> Anterior
        </button>
        <span class="text-lg">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Próxima <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/services/main.js';
import Swal from 'sweetalert2';

export default {
  name: 'AdminOrders',
  data() {
    return {
      allOrders: [], // Todos os pedidos
      ordersPerPage: 10,
      currentPage: 1,
      loading: true,
    };
  },
  async created() {
    await this.fetchOrders();
  },
  computed: {
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.ordersPerPage;
      const end = start + this.ordersPerPage;
      return this.allOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.allOrders.length / this.ordersPerPage);
    },
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        // A API de backend deve ser ajustada para suportar paginação, mas como não temos acesso,
        // vamos buscar todos e paginar no frontend.
        const response = await axios.get('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        this.allOrders = response.data;
      } catch (error) {
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível carregar os pedidos.',
          icon: 'error',
          background: '#1f2937',
          color: '#e5e7eb'
        });
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 'Processando': return 'bg-yellow-500/20 text-yellow-300';
        case 'Enviado': return 'bg-blue-500/20 text-blue-300';
        case 'Entregue': return 'bg-green-500/20 text-green-300';
        case 'Cancelado': return 'bg-red-500/20 text-red-300';
        default: return 'bg-gray-500/20 text-gray-300';
      }
    },
    async updateStatus(order) {
      const { value: newStatus } = await Swal.fire({
        title: 'Atualizar Status do Pedido',
        input: 'select',
        inputOptions: {
          'Processando': 'Processando',
          'Enviado': 'Enviado',
          'Entregue': 'Entregue',
          'Cancelado': 'Cancelado'
        },
        inputValue: order.status,
        showCancelButton: true,
        confirmButtonText: 'Atualizar',
        cancelButtonText: 'Cancelar',
        background: '#1f2937',
        color: '#e5e7eb',
      });

      if (newStatus) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`/api/orders/${order._id}/status`, { status: newStatus }, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          order.status = newStatus; // Atualiza o status localmente
          Swal.fire('Sucesso!', 'Status do pedido atualizado.', 'success');
        } catch (error) {
          Swal.fire('Erro!', 'Não foi possível atualizar o status.', 'error');
        }
      }
    },
    confirmDelete(order) {
      Swal.fire({
        title: 'Tem a certeza?',
        text: `Esta ação irá apagar permanentemente o pedido #${order._id}. Não é possível reverter.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'Cancelar',
        background: '#1f2937',
        color: '#e5e7eb'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/orders/${order._id}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            this.orders = this.orders.filter(o => o._id !== order._id);
            Swal.fire('Apagado!', 'O pedido foi apagado com sucesso.', 'success');
          } catch (error) {
            Swal.fire('Erro!', 'Não foi possível apagar o pedido.', 'error');
          }
        }
      });
    },
    // --- FUNÇÃO DE EXPORTAÇÃO ADICIONADA ---
    async exportData(format) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/admin/export?type=orders&format=${format}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_vendas.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error(`Erro ao exportar para ${format}:`, error);
        Swal.fire('Erro', 'Não foi possível exportar o relatório.', 'error');
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>