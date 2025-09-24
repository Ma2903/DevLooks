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
            <div class="relative flex items-center">
              <i class="fas fa-user absolute left-4 text-gray-400 z-10"></i>
              <input type="text" id="name" v-model="form.name"
                     class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="Digite seu nome completo" required />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative flex items-center">
              <i class="fas fa-envelope absolute left-4 text-gray-400 z-10"></i>
              <input type="email" id="email" v-model="form.email"
                     class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="exemplo@email.com" required />
            </div>
          </div>

          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
            <div class="relative flex items-center">
              <i class="fas fa-id-card absolute left-4 text-gray-400 z-10"></i>
              <input type="text" id="cpf" v-model="form.cpf"
                     class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="000.000.000-00" required />
            </div>
          </div>

          <div>
            <label for="telephone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <div class="relative flex items-center">
              <i class="fas fa-phone absolute left-4 text-gray-400 z-10"></i>
              <input type="tel" id="telephone" v-model="form.telephone"
                     class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="(11) 99999-9999" required />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div class="relative flex items-center">
              <i class="fas fa-lock absolute left-4 text-gray-400 z-10"></i>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password"
                     class="w-full p-3 pl-12 pr-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="Mínimo 6 caracteres" required />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 text-gray-400 focus:outline-none"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></button>
            </div>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha</label>
            <div class="relative flex items-center">
              <i class="fas fa-lock absolute left-4 text-gray-400 z-10"></i>
              <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="form.confirmPassword"
                     class="w-full p-3 pl-12 pr-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="Confirme sua senha" required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 text-gray-400 focus:outline-none"><i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></button>
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <div class="relative flex items-center">
              <i class="fas fa-map-pin absolute left-4 text-gray-400 z-10"></i>
              <input type="text" id="cep" v-model="form.cep" @blur="fetchAddress"
                     class="w-full p-3 pl-12 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="00000-000" required />
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
            <input type="text" id="address" v-model="form.address"
                   class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                   placeholder="Preenchido pelo CEP" />
          </div>
          
          <div class="grid grid-cols-2 gap-x-4 md:col-span-2">
              <div>
                <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
                <input type="text" id="number" v-model="form.number"
                       class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                       placeholder="Ex: 123" required />
              </div>
              <div>
                <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento</label>
                <input type="text" id="complement" v-model="form.complement"
                       class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                       placeholder="Apto, Bloco, etc."/>
              </div>
          </div>

          <div>
            <label for="bairro" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <input type="text" id="bairro" v-model="form.bairro"
                   class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                   placeholder="Preenchido pelo CEP" />
          </div>

          <div class="grid grid-cols-2 gap-x-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
              <input type="text" id="city" v-model="form.city"
                     class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="Preenchido pelo CEP" />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <input type="text" id="state" v-model="form.state"
                     class="w-full p-3 bg-gray-800 rounded-lg focus:outline-none ring-2 ring-transparent focus:ring-[#04d1b0] transition-all duration-300"
                     placeholder="Preenchido pelo CEP" />
            </div>
          </div>
          
        </div>
        
        <button type="submit" :disabled="loading" class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-4 mt-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading"><i class="fas fa-spinner animate-spin mr-2"></i></span>
          <span v-else><i class="fas fa-user-plus mr-2"></i></span>
          Cadastrar
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-400 text-lg">Já tem uma conta? <router-link to="/login" class="text-[#04d1b0] hover:underline">Faça login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/main";
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "Register",
  data() {
    return {
      form: {
        name: "", email: "", cpf: "", telephone: "",
        address: "", number: "", complement: "", bairro: "", cep: "", city: "", state: "",
        country: "Brasil", password: "", confirmPassword: "",
      },
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      loadingCep: false, // Propriedade para o loading do CEP
    };
  },
  // SUAS MÁSCARAS ESTÃO DE VOLTA AQUI, INTACTAS!
  watch: {
    'form.cpf'(newValue) {
      if (!newValue) return;
      this.form.cpf = newValue
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    'form.telephone'(newValue) {
      if (!newValue) return;
      const digits = newValue.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 10) this.form.telephone = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      else if (digits.length > 6) this.form.telephone = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      else if (digits.length > 2) this.form.telephone = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      else this.form.telephone = `(${digits})`;
    },
    'form.cep'(newValue) {
      if (!newValue) return;
      const digits = newValue.replace(/\D/g, '').slice(0, 8);
      this.form.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    }
  },
  methods: {
    async fetchAddress() {
      const cep = this.form.cep.replace(/\D/g, "");
      if (cep.length === 8) {
        try {
          this.loadingCep = true;
          const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
          if (response.data.erro) {
            Swal.fire({
              icon: 'error',
              title: 'CEP não encontrado',
              text: 'Por favor, verifique o CEP digitado.',
              background: "#1F2937",
              color: "#E5E7EB",
            });
          } else {
            this.form.address = response.data.logradouro;
            this.form.bairro = response.data.bairro;
            this.form.city = response.data.localidade;
            this.form.state = response.data.uf;
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          Swal.fire({
            icon: 'error',
            title: 'Erro na Consulta',
            text: 'Não foi possível consultar o CEP. Tente novamente mais tarde.',
            background: "#1F2937",
            color: "#E5E7EB",
          });
        } finally {
          this.loadingCep = false;
        }
      }
    },
    async handleRegister() {
      if(this.form.password !== this.form.confirmPassword){
        Swal.fire({
          icon: 'error', title: 'Erro', text: 'As senhas não coincidem!',
          background: "#1F2937", color: "#E5E7EB",
        });
        return;
      }

      this.loading = true;
      try {
        await api.post("/api/users", this.form);
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
          text: error.response?.data?.message || 'Não foi possível realizar o cadastro.',
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