<template>
    <div class="min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
      <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
        <div class="text-center mb-10">
          <h1 class="text-5xl font-extrabold text-purple-400 mt-6">Gerenciar Produtos</h1>
          <p class="text-gray-400 mt-3 text-lg">Adicione, edite ou exclua produtos</p>
        </div>
        <div class="flex justify-end mb-6">
          <router-link
            to="/admin/products/add"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <i class="fas fa-plus-circle mr-2"></i> Adicionar Produto
          </router-link>
        </div>
        <table class="w-full bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr class="bg-gray-700 text-gray-300">
              <th class="py-4 px-6"><i class="fas fa-tag mr-2"></i>Nome</th>
              <th class="py-4 px-6"><i class="fas fa-align-left mr-2"></i>Descrição</th>
              <th class="py-4 px-6"><i class="fas fa-dollar-sign mr-2"></i>Preço</th>
              <th class="py-4 px-6"><i class="fas fa-list-alt mr-2"></i>Categoria</th>
              <th class="py-4 px-6"><i class="fas fa-boxes mr-2"></i>Quantidade</th>
              <th class="py-4 px-6"><i class="fas fa-tools mr-2"></i>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="produto in produtos"
              :key="produto._id"
              class="border-b border-gray-700 hover:bg-gray-700"
            >
              <td class="py-4 px-6">{{ produto.name }}</td>
              <td class="py-4 px-6">{{ produto.description }}</td>
              <td class="py-4 px-6">{{ produto.price ? produto.price.toFixed(2) : 'N/A' }}</td>
              <td class="py-4 px-6">{{ produto.category }}</td>
              <td class="py-4 px-6">{{ produto.stock }}</td>
              <td class="py-4 px-6 flex space-x-4">
                <button
                  @click="handleEdit(produto._id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <i class="fas fa-edit mr-2"></i> Editar
                </button>
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
    </div>
</template>
  
<script>
import axios from "@/services/main";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      produtos: [],
      showDeleteModal: false,
      produtoSelecionado: null,
      imageFile: null, // Armazena o arquivo de imagem selecionado
    };
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await axios.get("/api/products");
        this.produtos = response.data;
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao carregar produtos.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
    async handleEdit(productId) {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        if (response.data) {
          this.$router.push(`/admin/products/edit/${productId}`);
        } else {
          throw new Error("Produto não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do produto:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao carregar os dados do produto. Por favor, tente novamente.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
    confirmarExclusao(produto) {
      this.produtoSelecionado = produto;
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
          this.deletarProduto();
        }
      });
    },
    cancelarExclusao() {
      this.produtoSelecionado = null;
    },
    async deletarProduto() {
      try {
        console.log("Tentando excluir o produto com ID:", this.produtoSelecionado._id); // Log para depuração
        await axios.delete(`/api/products/${this.produtoSelecionado._id}`);
        this.produtos = this.produtos.filter(p => p._id !== this.produtoSelecionado._id);
        this.cancelarExclusao();
        Swal.fire({
          icon: "success",
          title: "Produto Excluído",
          text: "Produto excluído com sucesso!",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      } catch (error) {
        console.error("Erro ao excluir produto:", error.response || error); // Log detalhado do erro
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao excluir produto.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0]; // Salva o arquivo de imagem
    },
    async cadastrarProduto() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("category", this.category);
      formData.append("stock", this.stock);
      formData.append("image", this.imageFile); // Adiciona a imagem ao formulário

      try {
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Produto cadastrado com sucesso!",
        });
        // ...existing code...
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao cadastrar produto.",
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
  min-width: 150px;
}

tr:hover {
  background-color: #2d3748;
}
</style>