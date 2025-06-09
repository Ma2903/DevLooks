<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-12 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-[#04d1b0] flex items-center gap-3">
          <i class="fas fa-tags"></i>
          Gerenciar Cupons
        </h1>
        <router-link
          to="/admin/coupons/add"
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i>
          Novo Cupom
        </router-link>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Código</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Valor</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Expira em</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-if="coupons.length === 0">
                <td colspan="6" class="text-center py-10 text-gray-400">
                  <p><i class="fas fa-ghost mr-2"></i>Nenhum cupom encontrado.</p>
                </td>
              </tr>
              <tr v-for="coupon in coupons" :key="coupon._id" class="hover:bg-gray-700/50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-[#04d1b0]">{{ coupon.code }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ coupon.discountType === 'percentage' ? 'Porcentagem' : 'Fixo' }}</td>
                <td class="px-6 py-4 whitespace-nowrap font-bold">{{ coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue.toFixed(2)}` }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ new Date(coupon.expirationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full',
                      coupon.isActive && new Date(coupon.expirationDate) >= new Date()
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    ]"
                  >
                    {{ coupon.isActive && new Date(coupon.expirationDate) >= new Date() ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <router-link :to="`/admin/coupons/edit/${coupon._id}`" class="text-blue-400 hover:text-blue-300 transition" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                  </router-link>
                  <button
                    @click="confirmarExclusao(coupon)"
                    class="text-red-500 hover:text-red-400 transition"
                    title="Deletar"
                  >
                    <i class="fas fa-trash-alt"></i> Deletar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CouponService from '@/services/CouponService';
import Swal from 'sweetalert2';

const coupons = ref([]);

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

onMounted(fetchCoupons);
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>