<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8">
    <div class="container mx-auto">
      <h1 class="text-4xl font-bold text-[#04d1b0] mb-8 flex items-center gap-3">
        <i class="fas fa-dollar-sign"></i>
        Gerenciamento de Vendas
      </h1>
      <div v-if="loading" class="text-center p-10">
        <i class="fas fa-spinner fa-spin text-3xl text-[#04d1b0]"></i>
        <p>A carregar pedidos...</p>
      </div>
      <div v-else-if="orders.length === 0" class="text-center bg-gray-800 p-8 rounded-lg">
        <p class="text-xl"><i class="fas fa-ghost mr-2"></i>Nenhuma venda encontrada.</p>
      </div>
      <div v-else class="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-700/50">
            <tr>
              <th class="px-6 py-3 text-left uppercase tracking-wider">ID do Pedido</th>
              <th class="px-6 py-3 text-left uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-3 text-left uppercase tracking-wider">Data</th>
              <th class="px-6 py-3 text-left uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-center uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-700/50">
              <td class="px-6 py-4 font-mono text-xs">{{ order._id }}</td>
              <td class="px-6 py-4">{{ order.user ? order.user.name : 'Utilizador Removido' }} <br> <span class="text-xs text-gray-400">{{ order.user ? order.user.email : '' }}</span></td>
              <td class="px-6 py-4">{{ new Date(order.createdAt).toLocaleDateString('pt-BR') }}</td>
              <td class="px-6 py-4 font-bold text-green-400">R$ {{ order.total.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-center space-x-4">
                <button @click="updateStatus(order)" class="text-blue-400 hover:text-blue-300 transition" title="Mudar Status"><i class="fas fa-edit"></i> Mudar Status</button>
                <button @click="confirmDelete(order)" class="text-red-500 hover:text-red-400 transition" title="Excluir Pedido"><i class="fas fa-trash-alt"></i> Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
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
      orders: [],
      loading: true,
    };
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        this.orders = response.data;
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
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>