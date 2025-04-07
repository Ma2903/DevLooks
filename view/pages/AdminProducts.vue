<template>
    <div class="min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
        <div class="text-center mb-10">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-6">Gerenciar Produtos</h1>
          <p class="text-gray-400 mt-3 text-lg">Adicione, edite ou exclua produtos</p>
        </div>
        <div class="flex justify-end mb-6">
          <router-link
            to="/add-product"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <i class="fas fa-plus-circle mr-2"></i> Adicionar Produto
          </router-link>
        </div>
        <table class="w-full text-left bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr class="bg-gray-700 text-gray-300">
              <th class="py-4 px-6">Nome</th>
              <th class="py-4 px-6">Preço</th>
              <th class="py-4 px-6">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="produto in produtos"
              :key="produto._id"
              class="border-b border-gray-700 hover:bg-gray-700"
            >
              <td class="py-4 px-6">{{ produto.nome }}</td>
              <td class="py-4 px-6">R$ {{ produto.preco.toFixed(2) }}</td>
              <td class="py-4 px-6 flex space-x-4">
                <router-link
                  :to="`/edit-product/${produto._id}`"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <i class="fas fa-edit mr-2"></i> Editar
                </router-link>
                <button
                  @click="confirmarExclusao(produto)"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <i class="fas fa-trash-alt mr-2"></i> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal de Confirmação -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 class="text-2xl font-bold text-red-500 mb-4 text-center">Confirmação de Exclusão</h2>
          <p class="text-gray-300 mb-4 text-center">
            Tem certeza que deseja excluir o produto <span class="text-red-500 font-bold">{{ produtoSelecionado?.nome }}</span>?
          </p>
          <div class="flex justify-between mt-6">
            <button
              @click="cancelarExclusao"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Cancelar
            </button>
            <button
              @click="deletarProduto"
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "@/services/main";
  
  export default {
    data() {
      return {
        produtos: [],
        showDeleteModal: false,
        produtoSelecionado: null,
      };
    },
    methods: {
      async carregarProdutos() {
        try {
          const response = await axios.get("/api/products");
          this.produtos = response.data;
        } catch (error) {
          console.error("Erro ao carregar produtos:", error);
          alert("Erro ao carregar produtos.");
        }
      },
      confirmarExclusao(produto) {
        this.produtoSelecionado = produto;
        this.showDeleteModal = true;
      },
      cancelarExclusao() {
        this.produtoSelecionado = null;
        this.showDeleteModal = false;
      },
      async deletarProduto() {
        try {
          await axios.delete(`/api/products/${this.produtoSelecionado._id}`);
          this.produtos = this.produtos.filter(p => p._id !== this.produtoSelecionado._id);
          this.cancelarExclusao();
          alert("Produto excluído com sucesso!");
        } catch (error) {
          console.error("Erro ao excluir produto:", error);
          alert("Erro ao excluir produto.");
        }
      },
    },
    mounted() {
      this.carregarProdutos();
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
  
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    text-align: left;
    padding: 8px;
  }
  
  th {
    background-color: #4a5568;
    color: white;
  }
  
  tr:hover {
    background-color: #2d3748;
  }
  </style>