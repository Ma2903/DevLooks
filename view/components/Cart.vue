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
                  Preço: <span class="font-bold text-[#04d1b0]">R$ {{ item.price ? item.price.toFixed(2) : 'N/A' }}</span>
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
                
                <!-- Sistema de CEP e Cálculo de Frete -->
                <div class="mb-4">
                    <label for="cep" class="block text-gray-300 mb-2 font-semibold">
                        <i class="fas fa-truck mr-1"></i> Calcular Frete
                    </label>
                    <div class="flex">
                        <input 
                            type="text" 
                            id="cep" 
                            v-model="cep" 
                            @input="applyCepMask"
                            @keyup.enter="calculateShipping" 
                            class="flex-1 px-4 py-2 rounded-l-lg bg-gray-900 border border-gray-700" 
                            placeholder="00000-000"
                            maxlength="9"
                        />
                        <button 
                            @click="calculateShipping" 
                            :disabled="loadingShipping"
                            class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-2 px-5 rounded-r-lg disabled:opacity-50"
                        >
                            <i v-if="!loadingShipping" class="fas fa-calculator"></i>
                            <i v-else class="fas fa-spinner fa-spin"></i>
                        </button>
                    </div>
                    <!-- Wrapper fixo que sempre existe no DOM -->
                    <div class="min-h-[60px] mt-2">
                        <transition name="fade" mode="out-in">
                            <div v-if="shippingError" key="error" class="text-red-400 text-sm">
                                <i class="fas fa-exclamation-triangle"></i> {{ shippingError }}
                            </div>
                            <div v-else-if="hasShippingInfo" key="success" class="p-3 bg-gray-700 rounded-lg">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-300">SEDEX</span>
                                    <span class="text-[#04d1b0] font-bold">R$ {{ (shippingCost || 0).toFixed(2) }}</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">
                                    <i class="fas fa-clock"></i> {{ shippingTime || 'Calculando...' }}
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="coupon" class="block text-gray-300 mb-2 font-semibold">Cupom de Desconto</label>
                    <div class="flex">
                        <input type="text" id="coupon" v-model="couponCodeInput" @keyup.enter="handleApplyCoupon" class="flex-1 px-4 py-2 rounded-l-lg bg-gray-900 border border-gray-700" placeholder="Digite seu cupom"/>
                        <button @click="handleApplyCoupon" class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-2 px-5 rounded-r-lg">Aplicar</button>
                    </div>
                </div>
                
                <hr class="border-gray-700 my-4" />
                <div class="space-y-2 text-lg">
                    <div class="flex justify-between text-gray-300">
                        <span>Subtotal ({{ totalItems }} itens)</span>
                        <span>R$ {{ subtotal.toFixed(2) }}</span>
                    </div>
                    <transition name="fade">
                        <div v-show="appliedCoupon" class="flex justify-between text-[#04d1b0]">
                            <span>Desconto ({{ appliedCoupon?.code }})</span>
                            <span>- R$ {{ discountAmount.toFixed(2) }}</span>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-show="hasShippingInfo" class="flex justify-between text-gray-300">
                            <span>Frete</span>
                            <span>R$ {{ (shippingCost || 0).toFixed(2) }}</span>
                        </div>
                    </transition>
                    <div class="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span class="text-[#04d1b0]">R$ {{ finalTotalWithShipping.toFixed(2) }}</span>
                    </div>
                </div>
                
                <div v-show="subtotal >= 150" class="mt-3 p-2 bg-green-900/30 rounded-lg text-green-400 text-sm text-center">
                    <i class="fas fa-gift"></i> Parabéns! Você ganhou frete grátis!
                </div>
                
                <button 
                    @click="goToCheckout" 
                    :disabled="shippingCost === null && subtotal < 150"
                    class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-6 rounded-lg mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i class="fas fa-credit-card"></i> Finalizar Compra
                </button>
                
                <div v-if="shippingCost === null && subtotal < 150" class="text-xs text-gray-400 text-center mt-2">
                    Calcule o frete para continuar
                </div>
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import CouponService from '@/services/CouponService';
import api from '@/services/main.js';
import Swal from 'sweetalert2';

const router = useRouter();
const cartItems = ref([]);
const couponCodeInput = ref('');
const appliedCoupon = ref(null);
const cep = ref('');
const shippingCost = ref(null);
const shippingTime = ref('');
const loadingShipping = ref(false);
const shippingError = ref('');
const shippingReady = ref(false); // Nova flag para controlar quando mostrar o resultado

// Computed property para controlar visibilidade do shipping
const hasShippingInfo = computed(() => {
    return shippingReady.value && shippingCost.value !== null && shippingCost.value !== undefined && !shippingError.value;
});

async function fetchCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        cartItems.value = [];
        return;
    }
    try {
        const response = await api.get('/api/cart');
        cartItems.value = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        cartItems.value = [];
    }
}

async function updateCartOnServer(newCart) {
    try {
        const response = await api.put('/api/cart/update', { cartItems: newCart });
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
    if (!isSilent) Swal.fire({ title: 'Erro!', text: error.response?.data?.message || 'Cupom inválido.', icon: 'error', background: '#1f2937', color: '#e5e7eb' });
  }
}

function applyCepMask(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    cep.value = value;
}

async function calculateShipping() {
    // Validação básica
    if (!cep.value || cep.value.length !== 9) {
        Swal.fire({
            icon: 'error',
            title: 'CEP Inválido',
            text: 'Por favor, digite um CEP válido no formato: 00000-000',
            background: '#1F2937',
            color: '#E5E7EB'
        });
        return;
    }
    
    // Frete grátis para compras acima de R$ 150
    if (subtotal.value >= 150) {
        // Esconde resultados anteriores primeiro
        shippingReady.value = false;
        loadingShipping.value = false;
        
        // Aguarda antes de mostrar resultado
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Atualiza com frete grátis
        shippingError.value = '';
        shippingCost.value = 0;
        shippingTime.value = 'Frete Grátis!';
        shippingReady.value = true;
        
        Swal.fire({
            icon: 'success',
            title: 'Frete Grátis!',
            text: 'Parabéns! Sua compra tem frete grátis.',
            background: '#1F2937',
            color: '#E5E7EB',
            confirmButtonColor: '#04d1b0'
        });
        return;
    }
    
        // Reseta estados antes de calcular
        shippingError.value = '';
        loadingShipping.value = true;
        shippingReady.value = false;
        await nextTick(); // Garante que o DOM seja atualizado antes de prosseguir
    
    try {
        // Calcula peso e dimensões totais do carrinho
        let totalWeight = 0;
        let maxHeight = 0;
        let maxWidth = 0;
        let maxLength = 0;
        
        for (const item of cartItems.value) {
            // O item do carrinho deve ter os dados de peso e dimensão do produto
            // Se não tiver, usa os valores padrão definidos no ProductModel.ts
            const itemWeight = item.weight || 0.5;
            totalWeight += itemWeight * item.quantity;
            
            // Dimensões padrão se não especificadas
            const itemDimensions = item.dimensions || { height: 10, width: 15, length: 20 };
            
            // Usa as maiores dimensões encontradas (empilhamento)
            if (itemDimensions.height > maxHeight) maxHeight = itemDimensions.height;
            if (itemDimensions.width > maxWidth) maxWidth = itemDimensions.width;
            if (itemDimensions.length > maxLength) maxLength = itemDimensions.length;
        }
        
        // Regra dos Correios: dimensões mínimas
        maxHeight = Math.max(maxHeight, 2); // Mínimo 2 cm
        maxWidth = Math.max(maxWidth, 11);  // Mínimo 11 cm
        maxLength = Math.max(maxLength, 16); // Mínimo 16 cm
        
        // Regra dos Correios: peso mínimo
        totalWeight = Math.max(totalWeight, 0.3); // Mínimo 300g (0.3kg)
        
        console.log('📦 Peso total do carrinho:', totalWeight.toFixed(2), 'kg');
        console.log('📏 Dimensões máximas (ajustadas):', { height: maxHeight, width: maxWidth, length: maxLength });
        
        const response = await api.post('/api/shipping/calculate', { 
            cep: cep.value,
            weight: totalWeight,
            dimensions: { height: maxHeight, width: maxWidth, length: maxLength }
        });
        
        console.log('✅ Frete calculado:', response.data);

        // Desliga loading primeiro
        loadingShipping.value = false;
        await nextTick();

        // Agora atualiza os valores do frete
        shippingCost.value = response.data.cost || 0;
        shippingTime.value = response.data.deliveryTime || '';
        shippingReady.value = true;
        
    } catch (error) {
        console.error('❌ Erro ao calcular frete:', error);

        loadingShipping.value = false;
        await nextTick();

        shippingError.value = error.response?.data?.error || 'Não foi possível calcular o frete. Tente novamente.';
        shippingReady.value = false;
        
        Swal.fire({
            icon: 'error',
            title: 'Erro ao calcular frete',
            text: error.response?.data?.error || 'Não foi possível calcular o frete. Tente novamente.',
            background: '#1F2937',
            color: '#E5E7EB'
        });
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
    
    // Verifica se o frete foi calculado (exceto se for frete grátis)
    if (subtotal.value < 150 && shippingCost.value === null) {
        Swal.fire({
            title: 'Atenção',
            text: 'Por favor, calcule o frete antes de prosseguir.',
            icon: 'warning',
            background: "#1F2937",
            color: "#E5E7EB"
        });
        return;
    }
    
    localStorage.setItem('checkoutData', JSON.stringify({
        cartItems: cartItems.value,
        appliedCoupon: appliedCoupon.value,
        subtotal: subtotal.value,
        discountAmount: discountAmount.value,
        shippingCost: shippingCost.value || 0,
        finalTotal: finalTotalWithShipping.value,
        cep: cep.value
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
const finalTotalWithShipping = computed(() => {
    const shipping = shippingCost.value || 0;
    return finalTotal.value + shipping;
});

onMounted(fetchCart);
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

/* Vue transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>