<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-emerald-400 flex items-center gap-3">
          <i class="fas fa-cogs"></i>
          Gerenciar Produtos
        </h1>
        <div class="flex items-center gap-4 mt-4 md:mt-0">
          <button @click="exportData('json')"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
            <i class="fas fa-file-code"></i> Exportar JSON
          </button>
          <button @click="exportData('csv')"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
            <i class="fas fa-file-csv"></i> Exportar CSV
          </button>
          <router-link
            to="/admin/products/add"
            class="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
          >
            <i class="fas fa-plus-circle"></i>
            Novo Produto
          </router-link>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gradient-to-r from-emerald-600 to-cyan-600">
            <tr>
              <th class="p-4 uppercase text-sm font-semibold">Nome</th>
              <th class="p-4 uppercase text-sm font-semibold">Descrição</th>
              <th class="p-4 uppercase text-sm font-semibold">Preço</th>
              <th class="p-4 uppercase text-sm font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedProdutos.length === 0">
              <td colspan="4" class="text-center py-10 text-gray-400">
                <i class="fas fa-ghost text-4xl mb-3"></i>
                <p>Nenhum produto encontrado.</p>
              </td>
            </tr>
            <tr v-for="produto in paginatedProdutos" :key="produto._id" class="border-b border-gray-700 hover:bg-gray-700/50 transition-all">
              <td class="p-4 font-medium">{{ produto.name }}</td>
              <td class="p-4 text-gray-400">{{ produto.description }}</td>
              <td class="p-4 font-bold text-green-400">R$ {{ produto.price.toFixed(2) }}</td>
              <td class="p-4 flex justify-center items-center gap-3">
                <router-link :to="`/admin/products/edit/${produto._id}`"
                  class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <i class="fas fa-edit"></i> Editar
                </router-link>
                <button @click="confirmarExclusao(produto)"
                  class="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  <i class="fas fa-trash-alt"></i> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <i class="fas fa-arrow-left"></i> Anterior
        </button>
        <span class="text-lg">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Próxima <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import api from "@/services/main.js";

export default {
  data() {
    return {
      produtos: [],
      currentPage: 1,
      produtosPerPage: 10,
    };
  },
  computed: {
    paginatedProdutos() {
      const start = (this.currentPage - 1) * this.produtosPerPage;
      const end = start + this.produtosPerPage;
      return this.produtos.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.produtos.length / this.produtosPerPage);
    },
  },
  mounted() {
    this.carregarProdutos();
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await api.get('/api/products');
        this.produtos = response.data;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao carregar produtos.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
    confirmarExclusao(produto) {
      Swal.fire({
        title: "Confirmação de Exclusão",
        text: `Tem certeza que deseja excluir o produto "${produto.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Excluir",
        cancelButtonText: "Cancelar",
        background: "#1F2937",
        color: "#E5E7EB",
      }).then(result => {
        if (result.isConfirmed) {
          this.deletarProduto(produto._id);
        }
      });
    },
    async deletarProduto(productId) {
      try {
        await api.delete(`/api/products/${productId}`);
        this.produtos = this.produtos.filter(p => p._id !== productId);
        Swal.fire({
          icon: "success",
          title: "Produto Excluído",
          text: "Produto excluído com sucesso!",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível excluir o produto.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
    async exportData(format) {
      try {
        const response = await api.get(`/api/admin/export?type=products&format=${format}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_produtos.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        Swal.fire('Acesso Negado', `Apenas administradores podem exportar relatórios.`, 'error');
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>