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
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                placeholder="Digite seu nome completo" 
                class="input-style pl-10" 
                required>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div class="relative">
              <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                placeholder="exemplo@email.com" 
                class="input-style pl-10" 
                required>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                :type="passwordFieldType" 
                id="password" 
                v-model="form.password" 
                placeholder="Crie uma senha forte" 
                class="input-style pl-10 pr-10" 
                required>
              <button 
                type="button" 
                @click="togglePasswordVisibility('password')" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                <i :class="passwordIsVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha</label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                :type="confirmPasswordFieldType" 
                id="confirmPassword" 
                v-model="form.confirmPassword" 
                placeholder="Confirme sua senha" 
                class="input-style pl-10 pr-10" 
                required>
              <button 
                type="button" 
                @click="togglePasswordVisibility('confirm')" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                <i :class="confirmPasswordIsVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-300 mb-2">CPF</label>
            <div class="relative">
              <i class="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="cpf" 
                v-model="form.cpf" 
                @input="formatCpf" 
                placeholder="000.000.000-00" 
                class="input-style pl-10" 
                maxlength="14" 
                required>
            </div>
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <div class="relative">
              <i class="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="tel" 
                id="phone" 
                v-model="form.phone" 
                @input="formatPhone" 
                placeholder="(00) 00000-0000" 
                class="input-style pl-10" 
                maxlength="15" 
                required>
            </div>
          </div>

          <div class="md:col-span-2">
            <hr class="border-gray-700 my-4">
            <p class="text-lg font-semibold text-center text-[#04d1b0]">Endereço</p>
          </div>

          <div class="relative md:col-span-2">
            <label for="cep" class="block text-sm font-medium text-gray-300 mb-2">CEP</label>
            <div class="relative">
              <i class="fas fa-map-marker-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="cep" 
                v-model="form.cep" 
                @input="formatCep" 
                @blur="fetchAddressByCep" 
                placeholder="00000-000" 
                class="input-style pl-10 pr-10" 
                maxlength="9" 
                required>
              <i v-if="isCepLoading" class="fas fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
            <div class="relative">
              <i class="fas fa-home absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="address" 
                v-model="form.address" 
                placeholder="Sua rua ou avenida" 
                class="input-style pl-10" 
                :disabled="isCepLoading" 
                required>
            </div>
          </div>

          <div>
            <label for="number" class="block text-sm font-medium text-gray-300 mb-2">Número</label>
            <div class="relative">
              <i class="fas fa-hashtag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="number" 
                v-model="form.number" 
                placeholder="Ex: 123" 
                class="input-style pl-10" 
                required>
            </div>
          </div>

          <div>
            <label for="complement" class="block text-sm font-medium text-gray-300 mb-2">Complemento (opcional)</label>
            <div class="relative">
              <i class="fas fa-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="complement" 
                v-model="form.complement" 
                placeholder="Apto, Bloco, etc." 
                class="input-style pl-10">
            </div>
          </div>
          
          <div>
            <label for="bairro" class="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
            <div class="relative">
              <i class="fas fa-map-signs absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="bairro" 
                v-model="form.bairro" 
                placeholder="Seu bairro" 
                class="input-style pl-10" 
                :disabled="isCepLoading" 
                required>
            </div>
          </div>
          
          <div>
            <label for="city" class="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
            <div class="relative">
              <i class="fas fa-city absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="city" 
                v-model="form.city" 
                placeholder="Sua cidade" 
                class="input-style pl-10" 
                :disabled="isCepLoading" 
                required>
            </div>
          </div>
          
          <div>
            <label for="state" class="block text-sm font-medium text-gray-300 mb-2">Estado (UF)</label>
            <div class="relative">
              <i class="fas fa-flag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="state" 
                v-model="form.state" 
                placeholder="UF" 
                class="input-style pl-10" 
                maxlength="2"
                :disabled="isCepLoading" 
                required>
            </div>
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-300 mb-2">País</label>
            <div class="relative">
              <i class="fas fa-globe-americas absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                id="country" 
                v-model="form.country" 
                class="input-style pl-10 bg-gray-700" 
                readonly>
            </div>
          </div>
        </div>
        
        <div class="mt-10 text-center">
          <button 
            type="submit" 
            class="w-full md:w-auto bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
            :disabled="loading">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Registrando...
            </span>
            <span v-else>
              <i class="fas fa-user-plus mr-2"></i>
              Registrar
            </span>
          </button>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Já tem uma conta? 
            <router-link to="/login" class="text-[#04d1b0] hover:text-[#03b89a] font-medium transition-colors">
              Faça login
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/services/main.js';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "Register",
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        cpf: '',
        phone: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        bairro: '',
        city: '',
        state: '',
        country: 'Brasil',
      },
      isCepLoading: false,
      loading: false,
      passwordIsVisible: false,
      confirmPasswordIsVisible: false,
    };
  },
  computed: {
    passwordFieldType() {
      return this.passwordIsVisible ? 'text' : 'password';
    },
    confirmPasswordFieldType() {
      return this.confirmPasswordIsVisible ? 'text' : 'password';
    }
  },
  methods: {
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.passwordIsVisible = !this.passwordIsVisible;
      } else if (field === 'confirm') {
        this.confirmPasswordIsVisible = !this.confirmPasswordIsVisible;
      }
    },
    
    formatCpf(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.form.cpf = value;
      }
    },
    
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        this.form.phone = value;
      }
    },
    
    formatCep(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length <= 8) {
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        this.form.cep = value;
      }
    },
    
    async fetchAddressByCep() {
      if (!this.form.cep) return;
      
      const cep = this.form.cep.replace(/\D/g, '');
      if (cep.length !== 8) {
        return;
      }
      
      this.isCepLoading = true;
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        
        if (data.erro) {
          Swal.fire({
            icon: 'warning',
            title: 'CEP não encontrado',
            text: 'Por favor, verifique o CEP digitado.',
            background: '#1F2937',
            color: '#E5E7EB',
            confirmButtonColor: '#04d1b0'
          });
          return;
        }
        
        // Preenche os campos com os dados do ViaCEP
        this.form.address = data.logradouro || '';
        this.form.bairro = data.bairro || '';
        this.form.city = data.localidade || '';
        this.form.state = data.uf || '';
        
        // Mostra mensagem de sucesso
        Swal.fire({
          icon: 'success',
          title: 'CEP encontrado!',
          text: 'Endereço preenchido automaticamente.',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao buscar CEP',
          text: 'Não foi possível buscar o endereço. Tente novamente.',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0'
        });
      } finally {
        this.isCepLoading = false;
      }
    },
    
    validateForm() {
      // Validação de senha
      if (this.form.password.length < 6) {
        Swal.fire({
          icon: 'warning',
          title: 'Senha muito curta',
          text: 'A senha deve ter pelo menos 6 caracteres.',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0'
        });
        return false;
      }
      
      if (this.form.password !== this.form.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Senhas não coincidem',
          text: 'Por favor, verifique se as senhas digitadas são iguais.',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0'
        });
        return false;
      }
      
      // Validação de CPF (básica)
      const cpf = this.form.cpf.replace(/\D/g, '');
      if (cpf.length !== 11) {
        Swal.fire({
          icon: 'warning',
          title: 'CPF inválido',
          text: 'Por favor, digite um CPF válido.',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0'
        });
        return false;
      }
      
      // Validação de telefone
      const phone = this.form.phone.replace(/\D/g, '');
      if (phone.length < 10 || phone.length > 11) {
        Swal.fire({
          icon: 'warning',
          title: 'Telefone inválido',
          text: 'Por favor, digite um telefone válido.',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0'
        });
        return false;
      }
      
      return true;
    },
    
    async handleRegister() {
      if (!this.validateForm()) {
        return;
      }
      
      this.loading = true;
      try {
        // Prepara o payload para enviar ao backend
        const payload = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          cpf: this.form.cpf.replace(/\D/g, ''),
          telephone: this.form.phone.replace(/\D/g, ''),
          cep: this.form.cep.replace(/\D/g, ''),
          address: this.form.address,
          number: this.form.number,
          complement: this.form.complement || '',
          bairro: this.form.bairro,
          city: this.form.city,
          state: this.form.state,
          country: this.form.country
        };
        
        const response = await api.post('/api/users', payload);
        
        if (response.data) {
          await Swal.fire({
            icon: 'success',
            title: 'Cadastro realizado com sucesso!',
            text: 'Você será redirecionado para a página de login.',
            background: '#1F2937',
            color: '#E5E7EB',
            confirmButtonColor: '#04d1b0',
            timer: 2000,
            showConfirmButton: false
          });
          
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Erro no cadastro:', error);
        
        let errorMessage = 'Não foi possível realizar o cadastro. Tente novamente.';
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Erro no Cadastro',
          text: errorMessage,
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#04d1b0'
        });
      } finally {
        this.loading = false;
      }
    }
  }
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
  transition: all 0.3s ease-in-out;
  font-size: 0.95rem;
}

.input-style:focus {
  outline: none;
  border-color: #04d1b0;
  box-shadow: 0 0 0 3px rgba(4, 209, 176, 0.2);
  background-color: #111827;
}

.input-style:hover:not(:disabled) {
  border-color: #4b5563;
}

.input-style:disabled {
  background-color: #374151;
  cursor: not-allowed;
  opacity: 0.7;
}

.input-style::placeholder {
  color: #6b7280;
}

.input-style[readonly] {
  background-color: #374151;
  cursor: not-allowed;
}

/* Animação do spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fa-spin {
  animation: spin 1s linear infinite;
}

/* Responsividade melhorada */
@media (max-width: 768px) {
  .m-10 {
    margin: 1rem;
  }
  
  .p-10 {
    padding: 1.5rem;
  }
  
  .text-5xl {
    font-size: 2rem;
  }
}
</style>