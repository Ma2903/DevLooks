<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
      <div class="text-center mb-10">
        <img src="../assets/Logo.png" alt="Logo" class="w-28 h-28 mx-auto rounded-full shadow-lg">
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-6">Crie sua Conta</h1>
        <p class="text-gray-400 mt-3 text-lg">Preencha os campos abaixo para se cadastrar</p>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="name" v-model="form.name" @blur="validateField('name')" 
                     :class="['w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent', errors.name ? 'focus:ring-red-500 ring-red-500' : 'focus:ring-[#04d1b0]']" 
                     placeholder="Digite seu nome completo" required />
            </div>
            <span v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</span>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative">
              <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="email" id="email" v-model="form.email" @blur="validateField('email')" 
                     :class="['w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent', errors.email ? 'focus:ring-red-500 ring-red-500' : 'focus:ring-[#04d1b0]']" 
                     placeholder="exemplo@email.com" required />
            </div>
            <span v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</span>
          </div>
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
            <div class="relative">
              <i class="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="cpf" v-model="form.cpf" @blur="validateField('cpf')" 
                     :class="['w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent', errors.cpf ? 'focus:ring-red-500 ring-red-500' : 'focus:ring-[#04d1b0]']" 
                     placeholder="000.000.000-00" required />
            </div>
            <span v-if="errors.cpf" class="text-red-400 text-sm mt-1">{{ errors.cpf }}</span>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <div class="relative">
              <i class="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="phone" v-model="form.phone" 
                     class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0]" 
                     placeholder="(11) 99999-9999" required />
            </div>
          </div>
           <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" @blur="validateField('password')" 
                     :class="['w-full pl-10 pr-12 py-4 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent', errors.password ? 'focus:ring-red-500 ring-red-500' : 'focus:ring-[#04d1b0]']" 
                     placeholder="Mínimo 6 caracteres" required />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></button>
            </div>
            <span v-if="errors.password" class="text-red-400 text-sm mt-1">{{ errors.password }}</span>
          </div>

          <div>
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <div class="relative">
              <i class="fas fa-map-pin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="cep" v-model="form.cep" 
                     class="w-full pl-10 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0]" 
                     placeholder="00000-000" required />
            </div>
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
            <input type="text" id="address" v-model="form.address" 
                   class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg cursor-not-allowed" 
                   placeholder="Preenchido pelo CEP" readonly />
          </div>
          <div class="grid grid-cols-2 gap-x-4">
              <div>
                <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
                <input type="text" id="number" v-model="form.number" 
                       class="w-full pl-4 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" 
                       placeholder="Ex: 123" required />
              </div>
              <div>
                <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento</label>
                <input type="text" id="complement" v-model="form.complement" 
                       class="w-full pl-4 pr-4 py-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]" 
                       placeholder="Apto, Bloco, etc."/>
              </div>
          </div>
          <div>
            <label for="bairro" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <input type="text" id="bairro" v-model="form.bairro" 
                   class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg cursor-not-allowed" 
                   placeholder="Preenchido pelo CEP" readonly />
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
              <input type="text" id="city" v-model="form.city" 
                     class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg cursor-not-allowed" 
                     placeholder="Preenchido pelo CEP" readonly />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <input type="text" id="state" v-model="form.state" 
                     class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg cursor-not-allowed" 
                     placeholder="Preenchido pelo CEP" readonly />
            </div>
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-300 mb-2">País</label>
            <input type="text" id="country" v-model="form.country" 
                   class="w-full pl-4 pr-4 py-4 bg-gray-700 rounded-lg cursor-not-allowed" 
                   placeholder="Preenchido pelo CEP" readonly />
          </div>
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-4 mt-8 rounded-lg shadow-lg">
          <span v-if="loading" class="animate-spin mr-2"><i class="fas fa-spinner"></i></span>
          <i class="fas fa-user-plus mr-2"></i> Cadastrar
        </button>
      </form>
      <div class="mt-8 text-center">
        <p class="text-gray-400 text-lg">Já tem uma conta? <router-link to="/login" class="text-[#04d1b0] hover:underline">Faça login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/services/main";
import Swal from 'sweetalert2';

export default {
  name: "Register",
  data() {
    return {
      form: {
        name: "", email: "", cpf: "", phone: "",
        address: "", number: "", complement: "", bairro: "", cep: "", city: "", state: "",
        country: "Brasil", password: "",
      },
      errors: { name: "", email: "", cpf: "", password: "" },
      showPassword: false,
      loading: false,
    };
  },
  watch: {
    'form.cpf'(newValue) {
      this.form.cpf = newValue.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
    },
    'form.phone'(newValue) {
      const digits = newValue.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 10) this.form.phone = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      else if (digits.length > 6) this.form.phone = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      else if (digits.length > 2) this.form.phone = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      else this.form.phone = digits;
    },
    'form.cep'(newValue) {
      const digits = newValue.replace(/\D/g, '').slice(0, 8);
      this.form.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
      if (this.form.cep.length === 9) this.fetchAddressFromCep(this.form.cep);
    }
  },
  methods: {
    async fetchAddressFromCep(cep) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        if (response.data.erro) return;
        this.form.address = response.data.logradouro;
        this.form.bairro = response.data.bairro;
        this.form.city = response.data.localidade;
        this.form.state = response.data.uf;
        this.form.country = "Brasil";
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    },
    validateField(field) {
      this.errors[field] = '';
    },
    async handleRegister() {
      this.loading = true;
      try {
        // CORREÇÃO: Cria um novo objeto 'payload' para renomear 'phone' para 'telephone'
        const payload = { ...this.form, telephone: this.form.phone };
        delete payload.phone; // Remove a chave 'phone' antiga

        await axios.post("/api/users", payload); // Envia o payload corrigido
        
        await Swal.fire({
          icon: 'success', title: 'Cadastro realizado!',
          text: 'Você será redirecionado para o login.',
          background: "#1F2937", color: "#E5E7EB",
          timer: 2000, showConfirmButton: false,
        });
        this.$router.push("/login");
      } catch (error) {
        Swal.fire({
          icon: 'error', title: 'Erro no Cadastro',
          text: error.response?.data?.error || 'Não foi possível realizar o cadastro.',
          background: "#1F2937", color: "#E5E7EB",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>