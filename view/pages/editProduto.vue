<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
        <div class="text-center mb-10">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-6">Editar Produto</h1>
          <p class="text-gray-400 mt-3 text-lg">Atualize os campos abaixo para editar o produto</p>
        </div>
        <form @submit.prevent="editarProduto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-300 mb-2">Nome do Produto</label>
              <div class="relative">
                <i class="fas fa-box absolute left-3 top-3 text-gray-400 mt-2"></i>
                <input
                  type="text"
                  id="nome"
                  v-model="produto.nome"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>
            </div>
            <div>
              <label for="descricao" class="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
              <div class="relative">
                <i class="fas fa-align-left absolute left-3 top-3 text-gray-400 mt-2"></i>
                <textarea
                  id="descricao"
                  v-model="produto.descricao"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite a descrição do produto"
                  required
                ></textarea>
              </div>
            </div>
            <div>
              <label for="preco" class="block text-sm font-medium text-gray-300 mb-2">Preço</label>
              <div class="relative">
                <i class="fas fa-dollar-sign absolute left-3 top-3 text-gray-400 mt-2"></i>
                <input
                  type="number"
                  id="preco"
                  v-model="produto.preco"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite o preço do produto"
                  required
                />
              </div>
            </div>
            <div>
              <label for="imagem" class="block text-sm font-medium text-gray-300 mb-2">URL da Imagem</label>
              <div class="relative">
                <i class="fas fa-image absolute left-3 top-3 text-gray-400 mt-2"></i>
                <input
                  type="url"
                  id="imagem"
                  v-model="produto.imagem"
                  class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite a URL da imagem do produto"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg mt-8"
          >
            <i class="fas fa-save mr-2"></i> Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        produto: {
          nome: '',
          descricao: '',
          preco: null,
          imagem: '',
        },
      };
    },
    methods: {
      async carregarProduto(id) {
        try {
          // Simulação de carregamento do produto (substitua pela chamada à API)
          const produtoCarregado = {
            nome: 'Produto Exemplo',
            descricao: 'Descrição do produto exemplo',
            preco: 100.0,
            imagem: 'https://via.placeholder.com/150',
          };
          this.produto = produtoCarregado;
        } catch (error) {
          console.error('Erro ao carregar produto:', error);
          alert('Erro ao carregar produto.');
        }
      },
      async editarProduto() {
        try {
          // Simulação de envio da edição (substitua pela chamada à API)
          console.log('Produto editado:', this.produto);
          alert('Produto editado com sucesso!');
        } catch (error) {
          console.error('Erro ao editar produto:', error);
          alert('Erro ao editar produto.');
        }
      },
    },
    mounted() {
      // Simulação de carregamento do produto ao montar o componente
      const produtoId = 1; // Substitua pelo ID real do produto
      this.carregarProduto(produtoId);
    },
  };
  </script>
  
  <style scoped>
  @import '@fortawesome/fontawesome-free/css/all.css';
  
  body {
    font-family: 'Fira Code', monospace;
  }
  
  button:hover {
    transform: scale(1.05);
  }
  
  input::placeholder,
  textarea::placeholder {
    color: #9CA3AF; /* Cor do placeholder */
  }
  </style>