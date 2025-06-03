<template>
  <div class="min-h-screen flex flex-col items-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-6 flex items-center justify-center gap-3">
          <i class="fas fa-cogs text-[#04d1b0]"></i>
          Gerenciar Produtos
        </h1>
        <p class="text-gray-400 mt-3 text-lg">Adicione, edite ou exclua produtos do seu ecommerce</p>
      </div>
      <div class="flex justify-end mb-6">
        <router-link
          to="/admin/products/add"
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i> Adicionar Produto
        </router-link>
      </div>
      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr class="bg-[#23272f] text-[#04d1b0]">
              <th class="py-4 px-6"><i class="fas fa-tag mr-2"></i>Nome</th>
              <th class="py-4 px-6"><i class="fas fa-align-left mr-2"></i>Descrição</th>
              <th class="py-4 px-6"><i class="fas fa-dollar-sign mr-2"></i>Preço</th>
              <th class="py-4 px-6"><i class="fas fa-list-alt mr-2"></i>Categoria</th>
              <th class="py-4 px-6"><i class="fas fa-boxes mr-2"></i>Estoque</th>
              <th class="py-4 px-6"><i class="fas fa-tools mr-2"></i>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="produto in produtos"
              :key="produto._id"
              class="border-b border-[#04d1b0]/30 hover:bg-[#23272f] transition"
            >
              <td class="py-4 px-6 font-semibold flex items-center gap-2">
                <i class="fas fa-box text-[#04d1b0]"></i>
                {{ produto.name }}
              </td>
              <td class="py-4 px-6 text-gray-300 truncate max-w-xs">{{ produto.description }}</td>
              <td class="py-4 px-6 text-[#04d1b0] font-bold">R$ {{ produto.price ? produto.price.toFixed(2) : 'N/A' }}</td>
              <td class="py-4 px-6">
                <span class="bg-[#4e44e1] text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <i class="fas fa-tag"></i> {{ produto.category }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span :class="produto.stock < 5 ? 'bg-red-600' : 'bg-[#04d1b0]'"
                  class="text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <i class="fas fa-boxes"></i> {{ produto.stock }}
                </span>
              </td>
              <td class="py-4 px-6 flex flex-col md:flex-row gap-2">
                <button
                  @click="handleEdit(produto._id)"
                  class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
                >
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button
                  @click="confirmarExclusao(produto)"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
                >
                  <i class="fas fa-trash-alt"></i> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
      showDeleteModal: false,
      produtoSelecionado: null,
      imageFile: null,
      previewUrl: null,
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
        console.error("Erro ao excluir produto:", error.response || error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao excluir produto.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.imageFile = file;
      if (file) {
        this.previewUrl = URL.createObjectURL(file);
      } else {
        this.previewUrl = null;
      }
    },
    async cadastrarProduto() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("category", this.category);
      formData.append("stock", this.stock);
      formData.append("image", this.imageFile);

      try {
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Produto cadastrado com sucesso!",
        });
        this.carregarProdutos();
        this.limparCampos();
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao cadastrar produto.",
        });
      }
    },
    limparCampos() {
      this.name = "";
      this.description = "";
      this.price = null;
      this.category = "";
      this.stock = null;
      this.imageFile = null;
      this.previewUrl = null;
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

button, .router-link-active {
  background-image: linear-gradient(to right, #04d1b0, #4e44e1);
  color: #fff;
  font-weight: bold;
  border-radius: 0.75rem;
  transition: transform 0.2s, background 0.2s;
}
button:hover, .router-link-active:hover {
  background-image: linear-gradient(to right, #03b89a, #3e3ab8);
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
  background-color: #23272f;
  color: #04d1b0;
  min-width: 150px;
}

tr:hover {
  background-color: #23272f;
}
</style>