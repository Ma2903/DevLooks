<template>
  <div class="bg-gray-900 p-8 rounded-3xl shadow-2xl border-2 border-[#04d1b0] animate-fade-in">
    <h2 class="text-2xl font-bold text-[#04d1b0] mb-6 flex items-center gap-2">
      <i class="fas fa-tasks"></i>
      Revise seu Pedido
    </h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      <div class="lg:col-span-3 space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-white flex items-center gap-2"><i class="fas fa-shipping-fast text-gray-400"></i> Entregar em:</h3>
          <div v-if="checkoutData.shippingAddress" class="bg-gray-800 p-4 rounded-lg text-gray-300 border-l-4 border-gray-700">
            <p class="font-bold">{{ checkoutData.shippingAddress.street }}, {{ checkoutData.shippingAddress.number }}</p>
            <p>{{ checkoutData.shippingAddress.neighborhood }}, {{ checkoutData.shippingAddress.city }} - {{ checkoutData.shippingAddress.state }}</p>
            <p>CEP: {{ checkoutData.shippingAddress.cep }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-white flex items-center gap-2"><i class="fas fa-box-open text-gray-400"></i> Itens no Carrinho:</h3>
          <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
            <div v-for="item in checkoutData.cartItems" :key="item.productId" class="flex items-center bg-gray-800 p-3 rounded-lg">
              <img :src="getImageUrl(item.image)" class="w-16 h-16 rounded-lg mr-4 object-cover border-2 border-gray-700">
              <div class="flex-grow">
                <p class="font-bold text-white">{{ item.name }}</p>
                <p class="text-sm text-gray-400">{{ item.quantity }}x <span v-if="item.selectedSize"> (Tamanho: {{item.selectedSize}})</span></p>
              </div>
              <p class="text-gray-300 font-semibold">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-gray-800 p-6 rounded-lg border-t-4 border-[#04d1b0] sticky top-8">
          <h3 class="text-xl font-semibold mb-4 text-white">Resumo Financeiro</h3>
          <div class="space-y-3 text-lg">
            <div class="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>R$ {{ checkoutData.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="checkoutData.appliedCoupon" class="flex justify-between text-[#04d1b0]">
              <span>Desconto ({{ checkoutData.appliedCoupon.code }})</span>
              <span>- R$ {{ checkoutData.discountAmount.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-700 pt-3 mt-3 flex justify-between font-bold text-2xl text-white">
              <span>Total</span>
              <span class="text-[#04d1b0]">R$ {{ checkoutData.finalTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between items-center">
      <router-link to="/checkout/address" class="text-gray-400 hover:text-white transition font-semibold">
        <i class="fas fa-arrow-left mr-2"></i> Voltar para Endereço
      </router-link>
      <button @click="$router.push('/checkout/payment')" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
        Continuar para Pagamento <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutReview",
  data() {
    return {
      checkoutData: {
        cartItems: [], appliedCoupon: null, subtotal: 0,
        discountAmount: 0, finalTotal: 0, shippingAddress: null,
      },
    };
  },
  created() {
    const data = localStorage.getItem("checkoutData");
    if (data) { this.checkoutData = JSON.parse(data); } 
    else { this.$router.push('/cart'); }
  },
  methods: {
    getImageUrl(imagePath) {
        if (!imagePath) return '';
        const cleanPath = imagePath.replace(/^public[\\/]/, '');
        return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>