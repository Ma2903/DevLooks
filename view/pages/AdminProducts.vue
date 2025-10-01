<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-12 px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-[#04d1b0] flex items-center gap-3">
          <i class="fas fa-cogs"></i>
          Gerenciar Produtos
        </h1>
        <div class="flex items-center gap-4 mt-4 md:mt-0">
            <button @click="exportData('json')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
                <i class="fas fa-file-code"></i> Exportar JSON
            </button>
            <button @click="exportData('csv')" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105">
                <i class="fas fa-file-csv"></i> Exportar CSV
            </button>
            <router-link
              to="/admin/products/add"
              class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
            >
              <i class="fas fa-plus-circle"></i>
              Novo Produto
            </router-link>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Nome</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Descrição</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Preço</th>
                <th class="px-6 py-4 text-right font-semibold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="produto in produtos" :key="produto._id" class="hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">{{ produto.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ produto.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap">R$ {{ produto.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/admin/products/edit/${produto._id}`" class="text-blue-400 hover:text-blue-300 mr-4">
                    <i class="fas fa-edit"></i> Editar
                  </router-link>
                  <button @click="confirmarExclusao(produto)" class="text-red-500 hover:text-red-400">
                    <i class="fas fa-trash-alt"></i> Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Mantido para compatibilidade, mas as chamadas usam 'api'
import Swal from "sweetalert2";
import api from "@/services/main.js"; // Instância configurada do Axios

export default {
  data() {
    return {
      produtos: [],
    };
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
        text: `Tem certeza que deseja excluir o produto \"${produto.name}\"?`,
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
    // --- FUNÇÃO DE EXPORTAÇÃO ADICIONADA ---
    async exportData(format) {
      try {
        // Chama a rota genérica, especificando type=products
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