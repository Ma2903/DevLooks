<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-extrabold text-[#04d1b0] mt-6 flex items-center justify-center gap-3">
          <i class="fas fa-edit"></i>
          Editar Produto
        </h1>
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
                step="0.01"
                min="0"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite o preço do produto"
                required
              />
            </div>
          </div>
          <div>
            <label for="imagem" class="block text-sm font-medium text-gray-300 mb-2">Imagem do Produto</label>
            <div class="relative flex flex-col gap-2">
              <i class="fas fa-image absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="file"
                id="imagem"
                @change="onFileChange"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Importe a imagem do produto"
                accept="image/*"
              />
            </div>
          </div>
          <div>
            <label for="estoque" class="block text-sm font-medium text-gray-300 mb-2">Estoque</label>
            <div class="relative">
              <i class="fas fa-boxes absolute left-3 top-3 text-gray-400 mt-2"></i>
              <input
                type="number"
                id="estoque"
                v-model="produto.estoque"
                min="0"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite o estoque do produto"
                required
              />
            </div>
          </div>
          <div>
            <label for="categoria" class="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
            <div class="relative">
              <i class="fas fa-tags absolute left-3 top-3 text-gray-400 mt-2"></i>
              <select
                id="categoria"
                v-model="produto.categoria"
                class="w-full pl-10 pr-4 py-4 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option value="avatares">Avatares</option>
                <option value="skins">Skins</option>
                <option value="acessorios">Acessórios</option>
                <option value="presentes">Presentes</option>
              </select>
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg mt-8 flex items-center justify-center gap-2"
        >
          <i class="fas fa-save"></i> Salvar Alterações
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import ProductService from '../services/ProductService';
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      produto: {
        nome: '',
        descricao: '',
        preco: null,
        imagem: null,
        imagemUrl: '',
        estoque: null,
        categoria: '',
      },
      previewUrl: null,
    };
  },
  methods: {
    async fetchProduct(productId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${productId}`
        );
        // Ajusta os campos para o padrão do formulário
        this.produto = {
          nome: response.data.name,
          descricao: response.data.description,
          preco: response.data.price,
          imagem: null,
          imagemUrl: response.data.image,
          estoque: response.data.stock,
          categoria: response.data.category,
        };
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.produto.imagem = file;
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.previewUrl = null;
      }
    },
    async editarProduto() {
      try {
        const formData = new FormData();
        formData.append('name', this.produto.nome);
        formData.append('description', this.produto.descricao);
        formData.append('price', this.produto.preco);
        if (this.produto.imagem) {
          formData.append('imagem', this.produto.imagem);
        }
        formData.append('stock', this.produto.estoque);
        formData.append('category', this.produto.categoria);

        await axios.put(`http://localhost:3000/api/products/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Produto editado com sucesso!",
          background: "#1F2937",
          color: "#E5E7EB",
        }).then(() => {
          this.$router.push("/admin/products");
        });
      } catch (error) {
        console.error('Erro ao editar produto:', error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao editar produto.",
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
    },
  },
  mounted() {
    const produtoId = this.$route.params.id;
    this.fetchProduct(produtoId);
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

input, textarea, select {
  background: #1f2937;
  color: #e5e7eb;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-family: 'Fira Code', monospace;
}
input:focus, textarea:focus, select:focus {
  border: 2px solid #04d1b0;
}

input::placeholder, textarea::placeholder {
  color: #9CA3AF;
}
</style>