<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-10 flex items-center justify-center gap-3">
        <i class="fas fa-shopping-cart text-[#04d1b0]"></i>
        Carrinho de Compras
      </h1>

      <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-2/3">
          <div v-for="(item, index) in cartItems" :key="item.productId + (item.selectedSize || '')" class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border-2 border-gray-700 hover:border-[#04d1b0] transition">
            <div class="flex items-center gap-6">
              <div class="relative">
                <img :src="getImageUrl(item.image)" :alt="item.name" class="w-24 h-24 object-cover rounded-lg border-2 border-[#04d1b0] shadow"/>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-tshirt text-[#04d1b0]"></i>
                  {{ item.name }}
                </h2>
                <p v-if="item.selectedSize" class="text-sm text-gray-400 font-semibold ml-6">Tamanho: {{ item.selectedSize }}</p>
                <p class="text-gray-300 flex items-center gap-1 mt-2">
                  <i class="fas fa-tag"></i>
                  Preço: <span class="font-bold text-[#04d1b0]">R$ {{ item.price.toFixed(2) }}</span>
                </p>
                <div class="flex items-center mt-4 gap-2">
                  <button @click="updateItemQuantity(index, item.quantity - 1)" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-lg"><i class="fas fa-minus"></i></button>
                  <span class="w-12 text-center text-gray-200 text-lg font-bold mx-2 py-1 px-2">{{ item.quantity }}</span>
                  <button @click="updateItemQuantity(index, item.quantity + 1)" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-lg"><i class="fas fa-plus"></i></button>
                </div>
              </div>
              <button @click="confirmRemoveFromCart(index)" class="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/3">
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-[#04d1b0] sticky top-8">
                <h2 class="text-2xl font-bold text-white mb-6"><i class="fas fa-receipt"></i> Resumo do Pedido</h2>
                <div class="mb-4">
                    <label for="coupon" class="block text-gray-300 mb-2 font-semibold">Cupom</label>
                    <div class="flex">
                        <input type="text" id="coupon" v-model="couponCodeInput" @keyup.enter="handleApplyCoupon" class="flex-1 px-4 py-2 rounded-l-lg bg-gray-900 border border-gray-700" placeholder="Digite seu cupom"/>
                        <button @click="handleApplyCoupon" class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-2 px-5 rounded-r-lg">Aplicar</button>
                    </div>
                </div>
                <hr class="border-gray-700 my-4" />
                <div class="space-y-2 text-lg">
                    <div class="flex justify-between text-gray-300"><span>Subtotal ({{ totalItems }} itens)</span><span>R$ {{ subtotal.toFixed(2) }}</span></div>
                    <div v-if="appliedCoupon" class="flex justify-between text-[#04d1b0]"><span>Desconto ({{ appliedCoupon.code }})</span><span>- R$ {{ discountAmount.toFixed(2) }}</span></div>
                    <div class="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold text-xl"><span>Total</span><span class="text-[#04d1b0]">R$ {{ finalTotal.toFixed(2) }}</span></div>
                </div>
                <button @click="goToCheckout" class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-6 rounded-lg mt-6 text-lg"><i class="fas fa-credit-card"></i> Finalizar Compra</button>
            </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <i class="fas fa-shopping-basket text-6xl text-[#04d1b0] mb-4"></i>
        <p class="text-2xl text-gray-300 mb-6">Seu carrinho está vazio.</p>
        <router-link to="/products" class="mt-4 inline-block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] font-bold py-3 px-6 rounded-lg"><i class="fas fa-store"></i> Ver Produtos</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CouponService from '@/services/CouponService';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();
const cartItems = ref([]);
const couponCodeInput = ref('');
const appliedCoupon = ref(null);

async function fetchCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        cartItems.value = [];
        return;
    }
    try {
        const response = await axios.get('/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cartItems.value = response.data;
    } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        cartItems.value = [];
    }
}

async function updateCartOnServer(newCart) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.put('/api/cart/update', { cartItems: newCart }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cartItems.value = response.data;
    } catch (error) {
        Swal.fire({ title: 'Erro', text: 'Não foi possível atualizar o carrinho.', icon: 'error', background: '#1f2937', color: '#e5e7eb' });
    }
}

async function updateItemQuantity(index, newQuantity) {
    const updatedCart = JSON.parse(JSON.stringify(cartItems.value));
    if (newQuantity > 0) {
        updatedCart[index].quantity = newQuantity;
    } else {
        updatedCart.splice(index, 1);
    }
    await updateCartOnServer(updatedCart);
}

function confirmRemoveFromCart(index) {
    const item = cartItems.value[index];
    Swal.fire({
        title: 'Remover Item',
        text: `Remover "${item.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sim, remover!', cancelButtonText: 'Cancelar',
        background: '#1f2937', color: '#e5e7eb'
    }).then((result) => {
        if (result.isConfirmed) {
            updateItemQuantity(index, 0);
        }
    });
}

async function handleApplyCoupon(isSilent = false) {
  if (!couponCodeInput.value.trim()) {
    appliedCoupon.value = null;
    return;
  }
  try {
    const validCoupon = await CouponService.validateCoupon(couponCodeInput.value);
    appliedCoupon.value = validCoupon;
    if (!isSilent) Swal.fire({ title: 'Sucesso!', text: `Cupom "${validCoupon.code}" aplicado!`, icon: 'success', background: '#1f2937', color: '#e5e7eb' });
  } catch (error) {
    appliedCoupon.value = null;
    if (!isSilent) Swal.fire({ title: 'Erro!', text: error.response?.data?.error || 'Erro.', icon: 'error', background: '#1f2937', color: '#e5e7eb' });
  }
}

function getImageUrl(imagePath) {
    if (!imagePath) return '';
    const cleanPath = imagePath.replace(/^public[\\/]/, '');
    return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
}

function goToCheckout() {
    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({
            title: 'Login Necessário',
            text: "Você precisa criar uma conta ou fazer login para finalizar a compra!",
            icon: 'info',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Fazer Login',
            denyButtonText: `Criar Conta`,
            cancelButtonText: 'Continuar Comprando',
            background: "#1F2937",
            color: "#E5E7EB",
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/login');
            } else if (result.isDenied) {
                router.push('/register');
            }
        });
        return;
    }
    localStorage.setItem('checkoutData', JSON.stringify({
        cartItems: cartItems.value,
        appliedCoupon: appliedCoupon.value,
        subtotal: subtotal.value,
        discountAmount: discountAmount.value,
        finalTotal: finalTotal.value
    }));
    
    router.push('/checkout/address');
}

const totalItems = computed(() => cartItems.value.reduce((t, i) => t + i.quantity, 0));
const subtotal = computed(() => cartItems.value.reduce((t, i) => t + (i.price * i.quantity), 0));
const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0;
  if (appliedCoupon.value.discountType === 'fixed') return appliedCoupon.value.discountValue;
  if (appliedCoupon.value.discountType === 'percentage') return subtotal.value * (appliedCoupon.value.discountValue / 100);
  return 0;
});
const finalTotal = computed(() => Math.max(0, subtotal.value - discountAmount.value));

onMounted(fetchCart);
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>