<template>
  <div class="bg-gray-900 p-8 rounded-3xl shadow-2xl border-2 border-[#04d1b0]">
    <h2 class="text-2xl font-bold text-[#04d1b0] mb-6">Revisão do Pedido</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-white">Entregar em:</h3>
          <div v-if="checkoutData.shippingAddress" class="bg-gray-800 p-4 rounded-lg text-gray-300">
            <p>{{ checkoutData.shippingAddress.street }}, {{ checkoutData.shippingAddress.number }}</p>
            <p>{{ checkoutData.shippingAddress.neighborhood }}, {{ checkoutData.shippingAddress.city }} - {{ checkoutData.shippingAddress.state }}</p>
            <p>CEP: {{ checkoutData.shippingAddress.cep }}</p>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 text-white">Itens no Carrinho:</h3>
          <div v-for="item in checkoutData.cartItems" :key="item.productId" class="flex items-center mb-4">
            <img :src="getImageUrl(item.image)" class="w-16 h-16 rounded-lg mr-4 object-cover">
            <div>
              <p class="font-bold text-white">{{ item.name }} ({{ item.quantity }}x)</p>
              <p class="text-gray-400">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-800 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4 text-white">Resumo Financeiro</h3>
        <div class="space-y-2 text-lg">
          <div class="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>R$ {{ checkoutData.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="checkoutData.appliedCoupon" class="flex justify-between text-[#04d1b0]">
            <span>Desconto ({{ checkoutData.appliedCoupon.code }})</span>
            <span>- R$ {{ checkoutData.discountAmount.toFixed(2) }}</span>
          </div>
          <div v-if="checkoutData.shippingInfo" class="flex justify-between text-gray-300">
            <span>Frete</span>
            <span>R$ {{ checkoutData.shippingInfo.cost.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold text-xl">
            <span>Total</span>
            <span class="text-[#04d1b0]">R$ {{ checkoutData.finalTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 flex justify-between items-center">
      <router-link to="/checkout/address" class="text-gray-400 hover:text-white transition">
        <i class="fas fa-arrow-left mr-2"></i> Voltar para Endereço
      </router-link>
      <button @click="finalizePurchase" class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition">
        <i class="fas fa-check-circle mr-2"></i> Confirmar Compra
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "CheckoutReview",
  data() {
    return {
      checkoutData: {
        cartItems: [], appliedCoupon: null, subtotal: 0,
        discountAmount: 0, finalTotal: 0, shippingInfo: null,
        shippingAddress: null,
      }
    };
  },
  created() {
    this.loadCheckoutData();
  },
  methods: {
    loadCheckoutData() {
      const data = localStorage.getItem("checkoutData");
      if (data) { this.checkoutData = JSON.parse(data); } 
      else { this.$router.push('/cart'); }
    },
    getImageUrl(imagePath) {
        if (!imagePath) return '';
        const cleanPath = imagePath.replace(/^public[\\/]/, '');
        return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
    async finalizePurchase() {
      const token = localStorage.getItem('token');
      if (!token) return;

      const payload = {
        cartItems: this.checkoutData.cartItems,
        couponCode: this.checkoutData.appliedCoupon ? this.checkoutData.appliedCoupon.code : null,
        shippingCost: this.checkoutData.shippingInfo ? this.checkoutData.shippingInfo.cost : 0,
        shippingAddress: this.checkoutData.shippingAddress
      };

      try {
        Swal.fire({
          title: 'A finalizar sua compra...', text: 'Por favor, aguarde.',
          didOpen: () => { Swal.showLoading() },
          background: "#1F2937", color: "#E5E7EB", allowOutsideClick: false,
        });

        await axios.post('/api/orders/checkout', payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        localStorage.removeItem('checkoutData');
        window.dispatchEvent(new Event('storage'));

        await Swal.fire({
          icon: 'success', title: 'Compra Realizada!', text: 'O seu pedido foi processado com sucesso!',
          background: "#1F2937", color: "#E5E7EB",
        });
        
        this.$router.push('/order-history');

      } catch (error) {
        Swal.fire({
          icon: 'error', title: 'Erro na Compra',
          text: error.response?.data?.error || 'Não foi possível finalizar a sua compra.',
          background: "#1F2937", color: "#E5E7EB"
        });
      }
    }
  }
};
</script>