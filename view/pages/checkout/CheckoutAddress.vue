<template>
  <div class="bg-gray-900 p-8 rounded-3xl shadow-2xl border-2 border-[#04d1b0]">
    <h2 class="text-2xl font-bold text-[#04d1b0] mb-6 flex items-center gap-2">
      <i class="fas fa-map-marker-alt"></i>
      Escolha o Endereço de Entrega
    </h2>

    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-3xl text-[#04d1b0]"></i>
      <p class="mt-2">A carregar os seus dados...</p>
    </div>

    <div v-else class="space-y-6">
      <div @click="addressChoice = 'profile'" class="p-4 rounded-lg cursor-pointer transition" 
           :class="addressChoice === 'profile' ? 'bg-gray-700 border-2 border-[#04d1b0]' : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'">
        <div class="flex items-center">
          <input type="radio" id="profile_address" v-model="addressChoice" value="profile" class="custom-radio">
          <label for="profile_address" class="ml-3 block text-lg font-medium text-white">Usar endereço do perfil</label>
        </div>
        <div v-if="addressChoice === 'profile'" class="mt-4 pl-8 text-gray-300 animate-fade-in-fast">
          <p class="font-bold">{{ profileAddress.street }}, {{ profileAddress.number }}</p>
          <p>{{ profileAddress.neighborhood }}, {{ profileAddress.city }} - {{ profileAddress.state }}</p>
          <p>CEP: {{ profileAddress.cep }}</p>
        </div>
      </div>

      <div @click="addressChoice = 'new'" class="p-4 rounded-lg cursor-pointer transition" 
           :class="addressChoice === 'new' ? 'bg-gray-700 border-2 border-[#04d1b0]' : 'bg-gray-800 border-2 border-transparent hover:border-gray-600'">
        <div class="flex items-center">
          <input type="radio" id="new_address" v-model="addressChoice" value="new" class="custom-radio">
          <label for="new_address" class="ml-3 block text-lg font-medium text-white">Enviar para um novo endereço</label>
        </div>
        <div v-if="addressChoice === 'new'" class="mt-4 pl-8 grid grid-cols-1 md:grid-cols-6 gap-4 animate-fade-in-fast">
          <div class="md:col-span-2">
            <input v-model="newAddress.cep" 
                   placeholder="CEP" 
                   class="input-style" 
                   maxlength="9">
          </div>
          <div class="md:col-span-4">
            <input v-model="newAddress.street" 
                   placeholder="Rua / Avenida" 
                   class="input-style input-readonly" 
                   readonly>
          </div>
          <div class="md:col-span-2">
            <input v-model="newAddress.number" 
                   placeholder="Número" 
                   class="input-style">
          </div>
          <div class="md:col-span-4">
            <input v-model="newAddress.complement" 
                   placeholder="Complemento (opcional)" 
                   class="input-style">
          </div>
          <div class="md:col-span-3">
            <input v-model="newAddress.neighborhood" 
                   placeholder="Bairro" 
                   class="input-style input-readonly" 
                   readonly>
          </div>
          <div class="md:col-span-2">
            <input v-model="newAddress.city" 
                   placeholder="Cidade" 
                   class="input-style input-readonly" 
                   readonly>
          </div>
          <div class="md:col-span-1">
            <input v-model="newAddress.state" 
                   placeholder="UF" 
                   class="input-style input-readonly" 
                   readonly>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="mt-8 space-y-4">
      <!-- Exibição do frete calculado -->
      <div v-if="shippingCalculated" class="bg-gray-800 p-4 rounded-lg border-l-4 mb-6"
           :class="shippingInfo.freeShipping ? 'border-green-500' : 'border-[#04d1b0]'">
        <h3 class="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <i class="fas fa-shipping-fast"></i>
          {{ shippingInfo.freeShipping ? 'Frete Grátis! 🎉' : 'Frete Calculado' }}
        </h3>
        <div class="text-gray-300">
          <p v-if="!shippingInfo.freeShipping"><strong>Serviço:</strong> {{ shippingInfo.service }}</p>
          <p><strong>Região:</strong> {{ shippingInfo.region }}</p>
          <p><strong>Prazo:</strong> {{ shippingInfo.deliveryTime }}</p>
          <p v-if="shippingInfo.freeShipping" class="text-green-400 font-semibold mt-2">
            Parabéns! Você ganhou frete grátis por compras acima de R$ 150,00
          </p>
          <p class="text-xl font-bold mt-2" :class="shippingInfo.freeShipping ? 'text-green-500' : 'text-[#04d1b0]'">
            Valor: {{ shippingInfo.freeShipping ? 'GRÁTIS' : `R$ ${shippingInfo.cost.toFixed(2)}` }}
          </p>
        </div>
      </div>

      <!-- Botão de calcular frete (centralizado quando não calculado) -->
      <div v-else class="text-center">
        <button @click="calculateShipping" 
                :disabled="calculatingShipping"
                class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-4 px-8 rounded-lg transition text-lg shadow-lg">
          <i v-if="calculatingShipping" class="fas fa-spinner fa-spin mr-2"></i>
          <i v-else class="fas fa-calculator mr-2"></i>
          {{ calculatingShipping ? 'Calculando...' : 'Calcular Frete' }}
        </button>
        <p class="text-gray-400 text-sm mt-2">É necessário calcular o frete para continuar</p>
      </div>

      <!-- Botões de navegação (sempre visíveis) -->
      <div class="flex justify-between items-center pt-4">
        <router-link to="/cart" class="text-gray-400 hover:text-white transition font-semibold">
          <i class="fas fa-arrow-left mr-2"></i> Voltar ao Carrinho
        </router-link>
        
        <button @click="goToReview" 
                :disabled="!shippingCalculated"
                class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-4 px-8 rounded-lg text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
          Continuar para Revisão <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/main.js"; // Use a instância configurada do Axios
import Swal from 'sweetalert2';

export default {
  name: "CheckoutAddress",
  data() {
    return {
      loading: true,
      addressChoice: 'profile',
      profileAddress: {},
      newAddress: {
        street: "", number: "", complement: "", neighborhood: "",
        city: "", state: "", cep: ""
      },
      calculatingShipping: false,
      shippingCalculated: false,
      shippingInfo: {
        service: '',
        cost: 0,
        deliveryTime: '',
        region: '',
        freeShipping: false
      }
    };
  },
  async created() {
    await this.fetchUserData();
  },
  watch: {
    'newAddress.cep'(newValue) {
      const digits = newValue.replace(/\D/g, '').slice(0, 8);
      this.newAddress.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
      if (this.newAddress.cep.length === 9) {
        this.fetchAddressFromCep(this.newAddress.cep);
      }
    },
    addressChoice() {
      // Reset shipping quando trocar de endereço
      this.shippingCalculated = false;
      this.shippingInfo = { service: '', cost: 0, deliveryTime: '', region: '', freeShipping: false };
    }
  },
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        const response = await api.get('/api/users/me');
        const userData = response.data;
        
        // --- CORREÇÃO APLICADA AQUI ---
        // Agora mapeamos os campos do objeto 'address' corretamente.
        if (userData.address && typeof userData.address === 'object') {
          this.profileAddress = {
            street: userData.address.street || '',
            number: userData.address.number || '',
            complement: userData.address.complement || '',
            neighborhood: userData.address.neighborhood || '',
            city: userData.address.city || '',
            state: userData.address.state || '',
            cep: userData.address.cep || ''
          };
        } else {
          // Fallback para o caso de o endereço ainda estar no formato antigo (improvável, mas seguro)
          this.profileAddress = { street: userData.address || '', /* ... */ };
        }
        
      } catch (error) {
        console.error("Erro ao buscar dados do utilizador:", error);
         Swal.fire({
            icon: 'error', title: 'Erro', text: 'Não foi possível carregar os dados do seu perfil.',
            background: '#1F2937', color: '#E5E7EB'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAddressFromCep(cep) {
      try {
        // Usando a instância 'api' para buscar o CEP para manter o padrão
        const response = await api.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        if (response.data.erro) {
          Swal.fire({
            icon: 'error', title: 'CEP não encontrado', text: 'Por favor, verifique o CEP digitado.',
            background: '#1F2937', color: '#E5E7EB'
          });
          return;
        }
        this.newAddress.street = response.data.logradouro;
        this.newAddress.neighborhood = response.data.bairro;
        this.newAddress.city = response.data.localidade;
        this.newAddress.state = response.data.uf;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    },
    
    async calculateShipping() {
      const selectedAddress = this.addressChoice === 'profile' ? this.profileAddress : this.newAddress;
      
      if (!selectedAddress.cep) {
        Swal.fire({
          icon: 'warning', title: 'CEP Necessário', 
          text: 'Por favor, informe o CEP para calcular o frete.',
          background: '#1F2937', color: '#E5E7EB'
        });
        return;
      }

      // Validar se novo endereço está completo
      if (this.addressChoice === 'new') {
        const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
        for (const field of requiredFields) {
          if (!this.newAddress[field]) {
            Swal.fire({
              icon: 'warning', title: 'Campos Obrigatórios', 
              text: `Por favor, preencha o campo '${field}' do endereço.`,
              background: '#1F2937', color: '#E5E7EB'
            });
            return;
          }
        }
      }

      this.calculatingShipping = true;

      try {
        // Obter dados do carrinho
        const checkoutDataString = localStorage.getItem('checkoutData');
        if (!checkoutDataString) {
          this.$router.push('/cart');
          return;
        }
        
        const checkoutData = JSON.parse(checkoutDataString);
        
        // Calcular peso total e dimensões estimadas do carrinho
        const totalWeight = checkoutData.cartItems.reduce((sum, item) => {
          // Estimativa: cada produto pesa 0.5kg
          return sum + (item.quantity * 0.5);
        }, 0);

        // Dimensões estimadas da embalagem (em cm)
        const dimensions = {
          height: 20,
          width: 30,
          length: 40
        };

        // Calcular total do carrinho (subtotal - desconto)
        const cartTotal = checkoutData.subtotal - (checkoutData.discountAmount || 0);

        const response = await api.post('/api/shipping/calculate', {
          cep: selectedAddress.cep,
          weight: totalWeight,
          dimensions: dimensions,
          cartTotal: cartTotal
        });

        this.shippingInfo = response.data;
        this.shippingCalculated = true;

      } catch (error) {
        console.error('Erro ao calcular frete:', error);
        Swal.fire({
          icon: 'error', 
          title: 'Erro ao Calcular Frete', 
          text: error.response?.data?.error || 'Não foi possível calcular o frete. Tente novamente.',
          background: '#1F2937', 
          color: '#E5E7EB'
        });
      } finally {
        this.calculatingShipping = false;
      }
    },
    
    goToReview() {
      if (!this.shippingCalculated) {
        Swal.fire({
          icon: 'warning', 
          title: 'Calcule o Frete', 
          text: 'Por favor, calcule o frete antes de continuar.',
          background: '#1F2937', 
          color: '#E5E7EB'
        });
        return;
      }

      let shippingAddress = null;
      if (this.addressChoice === 'profile') {
        shippingAddress = this.profileAddress;
      } else {
        const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
        for (const field of requiredFields) {
          if (!this.newAddress[field]) {
            Swal.fire({
              icon: 'warning', title: 'Campos Obrigatórios', text: `Por favor, preencha o campo '${field}' do novo endereço.`,
              background: '#1F2937', color: '#E5E7EB'
            });
            return;
          }
        }
        shippingAddress = this.newAddress;
      }
      
      const checkoutDataString = localStorage.getItem('checkoutData');
      if (!checkoutDataString) {
        this.$router.push('/cart');
        return;
      }
      
      const checkoutData = JSON.parse(checkoutDataString);
      checkoutData.shippingAddress = shippingAddress;
      checkoutData.shippingCost = this.shippingInfo.cost;
      checkoutData.shippingInfo = this.shippingInfo;
      
      // Recalcular o total com o frete
      const subtotalWithDiscount = checkoutData.subtotal - (checkoutData.discountAmount || 0);
      checkoutData.finalTotal = subtotalWithDiscount + this.shippingInfo.cost;
      
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      this.$router.push('/checkout/review');
    }
  },
};
</script>

<style scoped>
.input-style {
  width: 100%;
  background-color: #1f2937;
  border: 2px solid #374151;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #fff;
  transition: all 0.2s ease-in-out;
}

.input-style::placeholder {
  color: #6b7280;
}

.input-style:focus {
  outline: none;
  border-color: #04d1b0;
  box-shadow: 0 0 0 2px rgba(4, 209, 176, 0.5);
}

.input-readonly {
  background-color: #374151;
  cursor: not-allowed;
}

.custom-radio {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid #4b5563;
  background-color: #111827;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
  transition: all 0.2s ease-in-out;
}

.custom-radio:checked {
  border-color: #04d1b0;
}

.custom-radio:checked::before {
  content: '';
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: #04d1b0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.animate-fade-in-fast {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>