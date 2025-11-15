<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-emerald-400 flex items-center gap-3">
          <i class="fas fa-tags"></i>
          Gerenciar Cupons
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
          <router-link
            to="/admin/coupons/new"
            class="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
          >
            <i class="fas fa-plus-circle"></i>
            Novo Cupom
          </router-link>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gradient-to-r from-emerald-600 to-cyan-600">
            <tr>
              <th class="p-4 uppercase text-sm font-semibold">Código</th>
              <th class="p-4 uppercase text-sm font-semibold">Tipo</th>
              <th class="p-4 uppercase text-sm font-semibold">Valor</th>
              <th class="p-4 uppercase text-sm font-semibold">Expira em</th>
              <th class="p-4 uppercase text-sm font-semibold">Status</th>
              <th class="p-4 uppercase text-sm font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedCoupons.length === 0">
              <td colspan="6" class="text-center py-10 text-gray-400">
                <i class="fas fa-ghost text-4xl mb-3"></i>
                <p>Nenhum cupom encontrado.</p>
              </td>
            </tr>
            <tr v-for="coupon in paginatedCoupons" :key="coupon._id" class="border-b border-gray-700 hover:bg-gray-700/50 transition-all">
              <td class="p-4 font-mono text-emerald-400 font-medium">{{ coupon.code }}</td>
              <td class="p-4">{{ coupon.discountType === 'percentage' ? 'Porcentagem' : 'Fixo' }}</td>
              <td class="p-4 font-bold">{{ coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toFixed(2)}` }}</td>
              <td class="p-4">{{ new Date(coupon.expirationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) }}</td>
              <td class="p-4">
                <span :class="getCouponStatusClass(coupon)" class="px-3 py-1 rounded-full text-xs font-bold">
                  {{ getCouponStatus(coupon) }}
                </span>
              </td>
              <td class="p-4 flex justify-center items-center gap-3">
                <router-link :to="`/admin/coupons/edit/${coupon._id}`"
                  class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <i class="fas fa-edit"></i> Editar
                </router-link>
                <button @click="confirmarExclusao(coupon)"
                  class="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  <i class="fas fa-trash-alt"></i> Deletar
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import CouponService from '@/services/CouponService';
import axios from 'axios';
import Swal from 'sweetalert2';

const coupons = ref([]);
const currentPage = ref(1);
const couponsPerPage = 10;

const paginatedCoupons = computed(() => {
  const start = (currentPage.value - 1) * couponsPerPage;
  const end = start + couponsPerPage;
  return coupons.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(coupons.value.length / couponsPerPage);
});

async function fetchCoupons() {
  try {
    coupons.value = await CouponService.getAllCoupons();
  } catch (error) {
    Swal.fire({
      title: 'Erro!',
      text: 'Não foi possível buscar os cupons.',
      icon: 'error',
      background: '#1f2937',
      color: '#e5e7eb'
    });
  }
}

function getCouponStatus(coupon) {
  if (coupon.isActive && new Date(coupon.expirationDate) >= new Date()) {
    return 'Ativo';
  }
  return 'Inativo';
}

function getCouponStatusClass(coupon) {
  if (coupon.isActive && new Date(coupon.expirationDate) >= new Date()) {
    return 'bg-green-500/20 text-green-300';
  }
  return 'bg-red-500/20 text-red-300';
}

async function confirmarExclusao(coupon) {
  Swal.fire({
    title: 'Confirmação de Exclusão',
    text: `Tem certeza que deseja excluir o cupom "${coupon.code}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
    background: '#1F2937',
    color: '#E5E7EB',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await CouponService.deleteCoupon(coupon._id);
        coupons.value = coupons.value.filter((c) => c._id !== coupon._id);
        Swal.fire({
          icon: 'success',
          title: 'Cupom Excluído',
          text: 'Cupom excluído com sucesso!',
          background: '#1F2937',
          color: '#E5E7EB',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao excluir o cupom.',
          background: '#1F2937',
          color: '#E5E7EB',
        });
      }
    }
  });
}

async function exportData(format) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/admin/export?type=coupons&format=${format}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_cupons.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error(`Erro ao exportar para ${format}:`, error);
    Swal.fire('Erro', 'Não foi possível exportar o relatório.', 'error');
  }
}

onMounted(fetchCoupons);
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>
