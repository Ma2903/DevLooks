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

    <div v-if="!loading" class="mt-8 text-right">
      <button @click="goToReview" 
              class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg text-lg hover:shadow-xl transition transform hover:scale-105">
        Continuar para Revisão <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script>
// IMPORTANTE: Usando a MESMA importação do Register.vue
import axios from "@/services/main";
import Swal from 'sweetalert2';

export default {
  name: "CheckoutAddress",
  data() {
    return {
      loading: true,
      addressChoice: 'profile',
      profileAddress: {},
      newAddress: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: ""
      },
    };
  },
  async created() {
    await this.fetchUserData();
  },
  watch: {
    // EXATAMENTE o mesmo watcher do Register.vue para o CEP
    'newAddress.cep'(newValue) {
      const digits = newValue.replace(/\D/g, '').slice(0, 8);
      this.newAddress.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
      if (this.newAddress.cep.length === 9) {
        this.fetchAddressFromCep(this.newAddress.cep);
      }
    }
  },
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/users/me', {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = response.data;
        this.profileAddress = {
          street: userData.address,
          number: userData.number,
          complement: userData.complement,
          neighborhood: userData.bairro,
          city: userData.city,
          state: userData.state,
          cep: userData.cep
        };
      } catch (error) {
        console.error("Erro ao buscar dados do utilizador:", error);
      } finally {
        this.loading = false;
      }
    },
    
    // EXATAMENTE o mesmo método do Register.vue
    async fetchAddressFromCep(cep) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        if (response.data.erro) {
          Swal.fire({
            icon: 'error',
            title: 'CEP não encontrado',
            text: 'Por favor, verifique o CEP digitado.',
            background: '#1F2937',
            color: '#E5E7EB'
          });
          return;
        }
        this.newAddress.street = response.data.logradouro;
        this.newAddress.neighborhood = response.data.bairro;
        this.newAddress.city = response.data.localidade;
        this.newAddress.state = response.data.uf;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        Swal.fire({
          icon: 'error',
          title: 'Erro de Rede',
          text: 'Não foi possível buscar o CEP. Verifique sua conexão.',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      }
    },
    
    goToReview() {
      let shippingAddress = null;
      
      if (this.addressChoice === 'profile') {
        shippingAddress = this.profileAddress;
      } else {
        // Validação dos campos obrigatórios
        const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
        for (const field of requiredFields) {
          if (!this.newAddress[field]) {
            Swal.fire({
              icon: 'warning',
              title: 'Campos Obrigatórios',
              text: `Por favor, preencha o campo '${field}' do novo endereço.`,
              background: '#1F2937',
              color: '#E5E7EB'
            });
            return;
          }
        }
        shippingAddress = this.newAddress;
      }
      
      const checkoutDataString = localStorage.getItem('checkoutData');
      if (!checkoutDataString) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível encontrar os dados do carrinho. Por favor, tente novamente a partir do carrinho.',
          background: '#1F2937',
          color: '#E5E7EB'
        });
        this.$router.push('/cart');
        return;
      }
      
      const checkoutData = JSON.parse(checkoutDataString);
      checkoutData.shippingAddress = shippingAddress;
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