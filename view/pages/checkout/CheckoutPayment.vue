<template>
  <div class="bg-gray-900 p-8 rounded-3xl shadow-2xl border-2 border-[#04d1b0] animate-fade-in">
    <h2 class="text-2xl font-bold text-[#04d1b0] mb-6 flex items-center gap-2">
      <i class="fas fa-money-check-alt"></i>
      Pagamento
    </h2>

    <div class="bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <p class="text-gray-300 text-lg">
        Você será redirecionado para o ambiente seguro do Mercado Pago para finalizar a sua compra.
      </p>
      <img src="https://logopng.com.br/logos/mercado-pago-106.svg" alt="Mercado Pago Logo" class="h-12 mx-auto mt-4"/>
    </div>

    <div class="mt-8 flex justify-between items-center">
      <button @click="goBack" class="text-gray-400 hover:text-white transition font-semibold">
        <i class="fas fa-arrow-left mr-2"></i> Voltar para Revisão
      </button>
      <button @click="initiatePayment" :disabled="isLoading" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="isLoading">
          <i class="fas fa-spinner fa-spin mr-2"></i>Aguarde...
        </span>
        <span v-else>
          Ir para Pagamento <i class="fas fa-arrow-right ml-2"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/services/main';
import Swal from 'sweetalert2';

export default {
  name: "CheckoutPayment",
  data() {
    return {
      checkoutData: {},
      isLoading: false,
    };
  },
  created() {
    const data = localStorage.getItem('checkoutData');
    if (data) {
      this.checkoutData = JSON.parse(data);
    } else {
      // Se não houver dados, volta para o carrinho para segurança
      this.$router.push('/cart');
    }
  },
  methods: {
    goBack() {
      this.$router.push('/checkout/review');
    },
    async initiatePayment() {
      this.isLoading = true;
      try {
        // 1. Monta o payload com os dados do localStorage
        const payload = {
          items: this.checkoutData.cartItems.map(item => ({
            product: item.productId, // O campo correto é productId, não product
            quantity: item.quantity,
          })),
          shippingAddress: this.checkoutData.shippingAddress,
          shippingCost: this.checkoutData.shippingCost,
          couponCode: this.checkoutData.appliedCoupon ? this.checkoutData.appliedCoupon.code : null,
        };

        // 2. Chama a API de checkout do nosso back-end
        const response = await api.post('/api/orders/checkout', payload);

        // 3. Pega o link de pagamento retornado pelo back-end e redireciona o utilizador
        if (response.data && response.data.payment_url) {
          window.location.href = response.data.payment_url;
        } else {
          throw new Error('URL de pagamento não recebida do servidor.');
        }

      } catch (error) {
        console.error('Erro ao iniciar pagamento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao Iniciar Pagamento',
          text: error.response?.data?.message || 'Não foi possível comunicar com o servidor de pagamentos. Por favor, tente novamente.',
          background: "#1F2937",
          color: "#E5E7EB",
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Estilos mantidos para consistência visual se necessário */
</style>