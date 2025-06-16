<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-10 flex items-center justify-center gap-3">
        <i class="fas fa-shopping-cart text-[#04d1b0]"></i>
        Carrinho de Compras
      </h1>

      <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-2/3">
          <div
            v-for="item in cartItems"
            :key="item._id"
            class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border-2 border-gray-700 hover:border-[#04d1b0] transition"
          >
            <div class="flex items-center gap-6">
              <div class="relative">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-24 h-24 object-cover rounded-lg border-2 border-[#04d1b0] shadow"
                />
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-tshirt text-[#04d1b0]"></i>
                  {{ item.name }}
                </h2>
                <p class="text-gray-300 flex items-center gap-1">
                  <i class="fas fa-tag"></i>
                  Preço: <span class="font-bold text-[#04d1b0]">R$ {{ item.price.toFixed(2) }}</span>
                </p>
                <div class="flex items-center mt-4 gap-2">
                  <button
                    @click="decreaseQuantity(item._id)"
                    class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="w-12 text-center text-gray-200 text-lg font-bold mx-2 py-1 px-2">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="increaseQuantity(item._id)"
                    class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <button
                @click="confirmRemoveFromCart(item._id)"
                class="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-1"
                title="Remover do carrinho"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/3">
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-[#04d1b0] sticky top-8">
                <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <i class="fas fa-receipt text-[#04d1b0]"></i>
                    Resumo do Pedido
                </h2>

                <div class="mb-4">
                    <label for="coupon" class="block text-gray-300 mb-2 font-semibold">Cupom de Desconto</label>
                    <div class="flex">
                        <input
                            type="text"
                            id="coupon"
                            v-model="couponCodeInput"
                            @keyup.enter="handleApplyCoupon"
                            class="flex-1 px-4 py-2 rounded-l-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
                            placeholder="Digite seu cupom"
                        />
                        <button
                            @click="handleApplyCoupon"
                            class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-2 px-5 rounded-r-lg shadow transition duration-300"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
                
                <hr class="border-gray-700 my-4" />

                <div class="space-y-2 text-lg">
                    <div class="flex justify-between text-gray-300">
                        <span>Subtotal ({{ totalItems }} itens)</span>
                        <span>R$ {{ subtotal.toFixed(2) }}</span>
                    </div>
                    <div v-if="appliedCoupon" class="flex justify-between text-[#04d1b0]">
                        <span>Desconto ({{ appliedCoupon.code }})</span>
                        <span>- R$ {{ discountAmount.toFixed(2) }}</span>
                    </div>
                    <div class="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold text-xl text-white">
                        <span>Total</span>
                        <span class="text-[#04d1b0]">R$ {{ finalTotal.toFixed(2) }}</span>
                    </div>
                </div>

                <button
                    @click="goToCheckout"
                    class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 mt-6 text-lg"
                >
                    <i class="fas fa-credit-card"></i>
                    Finalizar Compra
                </button>
            </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <i class="fas fa-shopping-basket text-6xl text-[#04d1b0] mb-4"></i>
        <p class="text-2xl text-gray-300 mb-6">
          Seu carrinho está vazio.
        </p>
        <router-link
          to="/products"
          class="mt-4 inline-block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2 text-lg"
        >
          <i class="fas fa-store"></i>
          Ver Produtos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CouponService from '@/services/CouponService';
import Swal from 'sweetalert2';

// Estado Reativo
const router = useRouter();
const cartItems = ref([]);
const couponCodeInput = ref('');
const appliedCoupon = ref(null);

// --- Funções de Manipulação do Carrinho ---

function loadCartFromLocalStorage() {
  const cart = localStorage.getItem("cart");
  cartItems.value = cart ? JSON.parse(cart) : [];
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
}

function increaseQuantity(productId) {
  const item = cartItems.value.find((i) => i._id === productId);
  if (item) {
    item.quantity += 1;
    saveCartToLocalStorage();
  }
}

function decreaseQuantity(productId) {
  const item = cartItems.value.find((i) => i._id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    saveCartToLocalStorage();
  }
}

function confirmRemoveFromCart(productId) {
    Swal.fire({
        title: 'Remover Item',
        text: "Tem certeza que deseja remover este item do carrinho?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar',
        background: '#1f2937', // bg-gray-800
        color: '#e5e7eb' // text-gray-200
    }).then((result) => {
        if (result.isConfirmed) {
            cartItems.value = cartItems.value.filter((item) => item._id !== productId);
            saveCartToLocalStorage();
            // Se o cupom aplicado não for mais válido (ex: subtotal baixo), remove
            handleApplyCoupon(true); // Revalida o cupom silenciosamente
        }
    });
}

// --- Funções de Cupom e Checkout ---

async function handleApplyCoupon(isSilent = false) {
  if (!couponCodeInput.value.trim()) {
    appliedCoupon.value = null; // Limpa o cupom se o campo estiver vazio
    return;
  };

  try {
    const validCoupon = await CouponService.validateCoupon(couponCodeInput.value);
    appliedCoupon.value = validCoupon;
    if (!isSilent) {
        Swal.fire({
            title: 'Sucesso!',
            text: `Cupom "${validCoupon.code}" aplicado!`,
            icon: 'success',
            background: '#1f2937',
            color: '#e5e7eb'
        });
    }
  } catch (error) {
    appliedCoupon.value = null;
    if (!isSilent) {
        const errorMessage = error.response?.data?.error || 'Erro ao aplicar cupom.';
        Swal.fire({
            title: 'Erro!',
            text: errorMessage,
            icon: 'error',
            background: '#1f2937',
            color: '#e5e7eb'
        });
    }
  }
}

function getImageUrl(imagePath) {
    if (!imagePath) return '/view/assets/camisa.jpg'; // Imagem padrão
    // Constrói a URL para acessar a imagem servida pelo backend
    return `http://localhost:3000/${imagePath.replace(/\\/g, '/').replace('public/', '')}`;
}

function goToCheckout() {
    // Passa os dados do carrinho e do cupom para a página de checkout via localStorage
    const checkoutData = {
        cartItems: cartItems.value,
        appliedCoupon: appliedCoupon.value,
        subtotal: subtotal.value,
        discountAmount: discountAmount.value,
        finalTotal: finalTotal.value
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
  router.push("/checkout");
}


// --- Propriedades Computadas ---

const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0;
  
  if (appliedCoupon.value.discountType === 'fixed') {
    return appliedCoupon.value.discountValue;
  }
  
  if (appliedCoupon.value.discountType === 'percentage') {
    return subtotal.value * (appliedCoupon.value.discountValue / 100);
  }

  return 0;
});

const finalTotal = computed(() => {
  const totalAfterDiscount = subtotal.value - discountAmount.value;
  return totalAfterDiscount > 0 ? totalAfterDiscount : 0;
});


// --- Ciclo de Vida ---
onMounted(() => {
  loadCartFromLocalStorage();
});
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

/* Remove setas do input de número */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>