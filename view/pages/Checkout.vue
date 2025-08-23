<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-10 flex items-center justify-center gap-3">
        <i class="fas fa-credit-card text-[#04d1b0]"></i>
        Finalizar Compra
      </h1>
      <div class="bg-gray-900 p-8 rounded-3xl shadow-2xl border-2 border-[#04d1b0] max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-[#04d1b0] mb-6 flex items-center gap-2">
          <i class="fas fa-receipt text-[#04d1b0]"></i>
          Resumo do Pedido
        </h2>
        <div class="mb-4 flex flex-col gap-2">
          <p class="text-lg text-gray-300 flex items-center gap-2">
            <i class="fas fa-list-ol"></i>
            Total de Itens: <span class="font-bold">{{ totalItems }}</span>
          </p>
          <p class="text-lg text-gray-300 flex items-center gap-2">
            <i class="fas fa-money-bill-wave"></i>
            Total: <span class="font-bold text-green-400">R$ {{ totalPrice.toFixed(2) }}</span>
          </p>
        </div>
        <hr class="border-purple-700 mb-6" />

        <form @submit.prevent class="flex flex-col gap-6">
          <h3 class="text-xl font-bold text-[#04d1b0] flex items-center gap-2 mb-2">
            <i class="fas fa-wallet"></i>
            Escolha o método de pagamento
          </h3>
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="metodo" value="pix" class="accent-[#04d1b0]" />
              <i class="fas fa-qrcode text-[#04d1b0]"></i>
              <span>PIX</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="metodo" value="credito" class="accent-[#04d1b0]" />
              <i class="fas fa-credit-card text-blue-400"></i>
              <span>Cartão de Crédito</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="metodo" value="debito" class="accent-[#04d1b0]" />
              <i class="fas fa-credit-card text-yellow-400"></i>
              <span>Cartão de Débito</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="metodo" value="boleto" class="accent-[#04d1b0]" />
              <i class="fas fa-barcode text-gray-300"></i>
              <span>Boleto Bancário</span>
            </label>
          </div>

          <div v-if="metodo === 'pix'" class="bg-gray-900 border border-[#04d1b0] rounded-lg p-4 flex flex-col items-center gap-2">
            <i class="fas fa-qrcode text-4xl text-[#04d1b0]"></i>
            <span class="text-[#04d1b0] font-bold">Chave PIX:</span>
            <span class="text-gray-200 select-all">compras@lojadev.com.br</span>
            <span class="text-xs text-gray-400">(Simulação: copie a chave para pagar no app do seu banco)</span>
          </div>

          <div v-if="metodo === 'credito'" class="bg-gray-900 border border-blue-400 rounded-lg p-4 flex flex-col gap-4">
            <div class="flex gap-2 items-center">
              <div class="relative flex-1">
                <i class="fas fa-credit-card absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                <input type="text" maxlength="19" placeholder="Número do cartão" class="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-800 text-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div class="relative w-28">
                <i class="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                <input type="text" maxlength="5" placeholder="MM/AA" class="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-800 text-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div class="relative w-20">
                <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                <input type="text" maxlength="4" placeholder="CVV" class="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-800 text-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
              <input type="text" placeholder="Nome impresso no cartão" class="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-800 text-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div class="flex gap-2 items-center">
              <div class="relative flex-1">
                <i class="fas fa-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                <input type="text" maxlength="11" placeholder="CPF do titular" class="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-800 text-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div class="relative w-40">
                <i class="fas fa-coins absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                <select v-model="parcelas" class="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-800 text-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option :value="1">1x sem juros</option>
                  <option :value="2">2x sem juros</option>
                  <option :value="3">3x com juros (2,99% a.m.)</option>
                  <option :value="4">4x com juros (2,99% a.m.)</option>
                  <option :value="5">5x com juros (2,99% a.m.)</option>
                  <option :value="6">6x com juros (2,99% a.m.)</option>
                  <option :value="7">7x com juros (2,99% a.m.)</option>
                  <option :value="8">8x com juros (2,99% a.m.)</option>
                  <option :value="9">9x com juros (2,99% a.m.)</option>
                  <option :value="10">10x com juros (2,99% a.m.)</option>
                  <option :value="11">11x com juros (2,99% a.m.)</option>
                  <option :value="12">12x com juros (2,99% a.m.)</option>
                </select>
              </div>
            </div>
            <div v-if="parcelas > 2" class="text-xs text-yellow-400 flex items-center gap-1 mt-1">
              <i class="fas fa-exclamation-triangle"></i>
              Parcelas acima de 2x terão juros de 2,99% ao mês.
            </div>
          </div>

          <div v-if="metodo === 'debito'" class="bg-gray-900 border border-yellow-400 rounded-lg p-4 flex flex-col gap-3">
            <div class="flex gap-2">
              <input type="text" maxlength="19" placeholder="Número do cartão" class="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="text" maxlength="5" placeholder="Validade (MM/AA)" class="w-28 px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="text" maxlength="4" placeholder="CVV" class="w-20 px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <input type="text" placeholder="Nome impresso no cartão" class="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <input type="text" maxlength="11" placeholder="CPF do titular" class="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>

          <div v-if="metodo === 'boleto'" class="bg-gray-900 border border-gray-400 rounded-lg p-4 flex flex-col items-center gap-2">
            <i class="fas fa-barcode text-4xl text-gray-300"></i>
            <span class="text-gray-200 font-bold">Boleto gerado!</span>
            <span class="text-xs text-gray-400">(Simulação: o boleto seria gerado e enviado por e-mail)</span>
          </div>

          <button
            type="button"
            @click="finalizePurchase"
            class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 mt-2"
          >
            <i class="fas fa-check-circle"></i>
            Finalizar Pagamento
          </button>
        </form>

        <hr class="border-purple-700 my-6" />
        <div class="mt-2">
          <router-link
            to="/products"
            class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2"
          >
            <i class="fas fa-store"></i>
            Voltar para a Loja
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "Checkout",
  data() {
    return {
      metodo: "pix",
      parcelas: 1,
      totalItems: 0,
      totalPrice: 0,
    };
  },
  created() {
    this.loadCheckoutData();
  },
  methods: {
    loadCheckoutData() {
      const checkoutData = localStorage.getItem("checkoutData");
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        this.totalItems = data.cartItems.reduce((total, item) => total + item.quantity, 0);
        this.totalPrice = data.finalTotal || 0;
      }
    },
    async finalizePurchase() {
      const token = localStorage.getItem('token');
      const checkoutData = localStorage.getItem("checkoutData");

      if (!token || !checkoutData) {
        Swal.fire({ title: 'Erro', text: 'Informações da compra ou de login não encontradas.', icon: 'error', background: "#1F2937", color: "#E5E7EB" });
        return;
      }

      const { cartItems } = JSON.parse(checkoutData);

      try {
        const response = await axios.post('/api/orders/checkout',
          { cartItems },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutData');
        window.dispatchEvent(new Event('storage'));

        await Swal.fire({
          icon: 'success',
          title: 'Compra Realizada!',
          text: response.data.message,
          background: "#1F2937",
          color: "#E5E7EB",
        });

        const hasAvatarSlot = cartItems.some(item => item.category === 'avatares');
        if (hasAvatarSlot) {
          this.$router.push('/create-avatar');
        } else {
          this.$router.push('/profile');
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro na Compra',
          text: error.response?.data?.error || 'Não foi possível finalizar a sua compra.',
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    }
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

/* Estilos adicionais */
button, .router-link-active {
  background-image: linear-gradient(to right, #04d1b0, #4e44e1);
}
button:hover, .router-link-active:hover {
  background-image: linear-gradient(to right, #03b89a, #3e3ab8);
}
</style>