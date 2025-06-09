<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-12 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-[#04d1b0] flex items-center gap-3">
          <i class="fas fa-cogs"></i>
          Gerenciar Produtos
        </h1>
        <router-link
          to="/admin/products/add"
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i>
          Novo Produto
        </router-link>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Nome</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Descrição</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Preço</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Categoria</th>
                <th class="px-6 py-4 text-left font-semibold uppercase tracking-wider">Estoque</th>
                <th class="px-6 py-4 text-center font-semibold uppercase tracking-wider">Ações</th> <!-- Altere para text-center -->
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-if="produtos.length === 0">
                <td colspan="6" class="text-center py-10 text-gray-400">
                  <p><i class="fas fa-ghost mr-2"></i>Nenhum produto encontrado.</p>
                </td>
              </tr>
              <tr v-for="produto in produtos" :key="produto._id" class="hover:bg-gray-700/50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-[#04d1b0]">{{ produto.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-300 truncate max-w-xs">{{ produto.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap font-bold text-[#04d1b0]">R$ {{ produto.price ? produto.price.toFixed(2) : 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="bg-[#4e44e1] text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {{ produto.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="produto.stock < 5 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'"
                    class="px-3 py-1 text-xs font-bold rounded-full"
                  >
                    {{ produto.stock }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex items-center justify-center gap-4"> <!-- Altere para text-center -->
                  <router-link :to="`/admin/products/edit/${produto._id}`" class="text-blue-400 hover:text-blue-300 transition flex items-center gap-1" title="Editar">
                    <i class="fas fa-edit"></i> <span>Editar</span>
                  </router-link>
                  <button @click="confirmarExclusao(produto)" class="text-red-500 hover:text-red-400 transition flex items-center gap-1" title="Excluir">
                    <i class="fas fa-trash-alt"></i> <span>Excluir</span>
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
import axios from "@/services/main";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      produtos: [],
    };
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await axios.get("/api/products");
        this.produtos = response.data;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erro",
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
        await axios.delete(`/api/products/${productId}`);
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
          text: "Erro ao excluir produto.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
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
</style>