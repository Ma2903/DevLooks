<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center py-12 px-4">
    <div class="max-w-xl w-full">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-8 flex items-center justify-center gap-3">
        <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
        {{ isEditing ? 'Editar Cupom' : 'Novo Cupom' }}
      </h1>
      
      <form @submit.prevent="handleSubmit" class="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 space-y-6">
        <div>
          <label for="code" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Código do Cupom</label>
          <input 
            v-model="form.code" 
            type="text" 
            id="code" 
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" 
            placeholder="Ex: DEVSUPER15"
            required
          >
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="discountType" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Tipo</label>
            <select 
              v-model="form.discountType" 
              id="discountType" 
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" 
              required
            >
              <option value="percentage">Porcentagem (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
          </div>
          <div>
            <label for="discountValue" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Valor</label>
            <input 
              v-model.number="form.discountValue" 
              type="number" 
              id="discountValue" 
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" 
              step="0.01" 
              placeholder="Ex: 15"
              required
            >
          </div>
        </div>
        
        <div>
          <label for="expirationDate" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Data de Expiração</label>
          <input 
            v-model="form.expirationDate" 
            type="date" 
            id="expirationDate" 
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" 
            required
          >
        </div>
        
        <div class="flex items-center">
          <input 
            type="checkbox" 
            v-model="form.isActive" 
            id="isActive" 
            class="h-5 w-5 bg-gray-700 border-gray-600 rounded text-[#04d1b0] focus:ring-[#04d1b0]"
          >
          <label for="isActive" class="ml-3 text-gray-300">Cupom Ativo</label>
        </div>
        
        <div class="flex justify-end pt-4 gap-4">
            <router-link to="/admin/coupons" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition">
                Cancelar
            </router-link>
            <button 
              type="submit" 
              class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
            >
              <i class="fas fa-save mr-2"></i>
              {{ isEditing ? 'Atualizar Cupom' : 'Salvar Cupom' }}
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CouponService from '@/services/CouponService';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const couponId = ref(route.params.id || null);
const isEditing = computed(() => !!couponId.value);

const form = ref({
  code: '',
  discountType: 'percentage',
  discountValue: null,
  expirationDate: '',
  isActive: true,
});

async function handleSubmit() {
  const action = isEditing.value ? 'atualizado' : 'criado';
  try {
    if (isEditing.value) {
      await CouponService.updateCoupon(couponId.value, form.value);
    } else {
      await CouponService.createCoupon(form.value);
    }
    Swal.fire({
      title: 'Sucesso!',
      text: `Cupom ${action} com sucesso!`,
      icon: 'success',
      background: '#1f2937',
      color: '#e5e7eb'
    });
    router.push('/admin/coupons');
  } catch (error) {
    Swal.fire({
      title: 'Erro!',
      text: `Ocorreu um erro ao salvar o cupom.`,
      icon: 'error',
      background: '#1f2937',
      color: '#e5e7eb'
    });
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      const coupon = await CouponService.getCouponById(couponId.value);
      // O 'T' é necessário para o input type="date" interpretar corretamente
      const formattedDate = new Date(coupon.expirationDate).toISOString().split('T')[0];
      form.value = {
        ...coupon,
        expirationDate: formattedDate
      };
    } catch (error) {
       Swal.fire({
         title: 'Erro!',
         text: 'Não foi possível carregar os dados do cupom.',
         icon: 'error',
         background: '#1f2937',
         color: '#e5e7eb'
       });
    }
  }
});
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

/* Garante que o calendário do input de data também seja escuro em navegadores que suportam */
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>