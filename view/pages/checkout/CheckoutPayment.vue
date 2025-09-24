<template>
  <div class="bg-gray-900 p-8 rounded-3xl shadow-2xl border-2 border-[#04d1b0] animate-fade-in">
    <h2 class="text-2xl font-bold text-[#04d1b0] mb-6 flex items-center gap-2">
      <i class="fas fa-money-check-alt"></i>
      Pagamento
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-white">Escolha como pagar:</h3>
        
        <div @click="paymentMethod = 'credit_card'" :class="paymentMethod === 'credit_card' ? 'payment-option-selected' : 'payment-option'">
          <i class="fas fa-credit-card"></i><span>Cartão de Crédito</span>
        </div>
        <div @click="paymentMethod = 'pix'" :class="paymentMethod === 'pix' ? 'payment-option-selected' : 'payment-option'">
          <i class="fab fa-pix"></i><span>PIX</span>
        </div>
        <div @click="paymentMethod = 'boleto'" :class="paymentMethod === 'boleto' ? 'payment-option-selected' : 'payment-option'">
          <i class="fas fa-barcode"></i><span>Boleto Bancário</span>
        </div>

        <div v-if="paymentMethod === 'credit_card'" class="mt-6 space-y-4 animate-fade-in-fast bg-gray-800 p-4 rounded-lg border border-gray-700">
          <input type="text" placeholder="Número do Cartão (xxxx xxxx xxxx xxxx)" class="input-style">
          <input type="text" placeholder="Nome no Cartão" class="input-style">
          <div class="flex gap-4">
            <input type="text" placeholder="Validade (MM/AA)" class="input-style">
            <input type="text" placeholder="CVV" class="input-style">
          </div>
          <div>
            <label for="installments" class="block text-sm font-medium text-gray-300 mb-2">Parcelas</label>
            <select id="installments" v-model="selectedInstallment" class="input-style">
              <option v-for="option in installmentOptions" :key="option.installments" :value="option.installments">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg border-t-4 border-[#04d1b0]">
        <h3 class="text-xl font-semibold mb-4 text-white">Resumo do Pedido</h3>
        <div v-if="checkoutData" class="space-y-3 text-lg">
          <div class="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>R$ {{ checkoutData.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="checkoutData.appliedCoupon" class="flex justify-between text-[#04d1b0]">
            <span>Desconto ({{ checkoutData.appliedCoupon.code }})</span>
            <span>- R$ {{ checkoutData.discountAmount.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-700 pt-3 mt-3 flex justify-between font-bold text-2xl text-white">
            <span>Total a Pagar</span>
            <span class="text-[#04d1b0]">R$ {{ checkoutData.finalTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between items-center">
      <router-link to="/checkout/review" class="text-gray-400 hover:text-white transition font-semibold">
        <i class="fas fa-arrow-left mr-2"></i> Voltar para Revisão
      </router-link>
      <button @click="finalizePurchase" :disabled="!paymentMethod" class="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fas fa-lock mr-2"></i> Finalizar Compra
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "CheckoutPayment",
  data() {
    return {
      checkoutData: null,
      paymentMethod: null,
      selectedInstallment: 1, // Parcela padrão
    };
  },
  computed: {
    // Calcula as opções de parcelamento
    installmentOptions() {
      if (!this.checkoutData) return [];
      
      const total = this.checkoutData.finalTotal;
      const options = [];
      const maxInstallments = 12; // Máximo de 12 parcelas
      const interestRate = 0.015; // Exemplo: 1.5% de juros ao mês para mais de 3x

      for (let i = 1; i <= maxInstallments; i++) {
        if (i <= 3) { // Até 3x sem juros
          options.push({
            installments: i,
            label: `${i}x de R$ ${(total / i).toFixed(2)} (sem juros)`
          });
        } else { // Acima de 3x com juros
          const totalWithInterest = total * (1 + interestRate * (i - 3));
          options.push({
            installments: i,
            label: `${i}x de R$ ${(totalWithInterest / i).toFixed(2)} (com juros)`
          });
        }
      }
      return options;
    }
  },
  created() {
    const data = localStorage.getItem("checkoutData");
    if (data) { this.checkoutData = JSON.parse(data); } 
    else { this.$router.push('/cart'); }
  },
  methods: {
    async finalizePurchase() {
      const token = localStorage.getItem('token');
      if (!token) return;

      const payload = {
        cartItems: this.checkoutData.cartItems,
        couponCode: this.checkoutData.appliedCoupon ? this.checkoutData.appliedCoupon.code : null,
        shippingCost: 0,
        shippingAddress: this.checkoutData.shippingAddress,
        paymentMethod: this.paymentMethod,
        installments: this.paymentMethod === 'credit_card' ? this.selectedInstallment : 1,
      };

      try {
        Swal.fire({
          title: 'Processando pagamento...', text: 'Por favor, aguarde.',
          didOpen: () => { Swal.showLoading() },
          background: "#1F2937", color: "#E5E7EB", allowOutsideClick: false,
        });

        await axios.post('/api/orders/checkout', payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        localStorage.removeItem('checkoutData');
        window.dispatchEvent(new Event('storage'));

        await Swal.fire({
          icon: 'success', title: 'Compra Realizada!', text: 'Seu pedido foi processado com sucesso!',
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

<style scoped>
.payment-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #1f2937;
  border: 2px solid transparent;
  font-weight: 600;
}
.payment-option:hover {
  border-color: #4b5563;
}
.payment-option-selected {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #374151;
  border: 2px solid #04d1b0;
  font-weight: 600;
}
.input-style {
  width: 100%;
  background-color: #1f2937;
  border: 2px solid #4b5563;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #fff;
  transition: all 0.2s;
}
.input-style:focus {
  outline: none;
  border-color: #04d1b0;
}
.animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
.animate-fade-in-fast { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>