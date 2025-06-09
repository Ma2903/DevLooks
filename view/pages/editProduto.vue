<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center py-12 px-4">
    <div class="max-w-xl w-full">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-8 flex items-center justify-center gap-3">
        <i class="fas fa-edit"></i>
        Editar Produto
      </h1>

      <form @submit.prevent="editarProduto" class="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 space-y-6">
        <div>
          <label for="nome" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Nome do Produto</label>
          <input
            type="text"
            id="nome"
            v-model="produto.nome"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div>
          <label for="descricao" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Descrição</label>
          <textarea
            id="descricao"
            v-model="produto.descricao"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
            placeholder="Digite a descrição do produto"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="preco" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Preço</label>
            <input
              type="number"
              id="preco"
              v-model="produto.preco"
              step="0.01"
              min="0"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
              placeholder="Digite o preço do produto"
              required
            />
          </div>

          <div>
            <label for="estoque" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Estoque</label>
            <input
              type="number"
              id="estoque"
              v-model="produto.estoque"
              min="0"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
              placeholder="Digite o estoque do produto"
              required
            />
          </div>
        </div>

        <div>
          <label for="categoria" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Categoria</label>
          <select
            id="categoria"
            v-model="produto.categoria"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
            required
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option value="avatares">Avatares</option>
            <option value="skins">Skins</option>
            <option value="acessorios">Acessórios</option>
            <option value="presentes">Presentes</option>
          </select>
        </div>

        <div>
          <label for="imagem" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Imagem do Produto</label>
          <input
            type="file"
            id="imagem"
            @change="onFileChange"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
            accept="image/*"
          />
          <img
            v-if="previewUrl || produto.imagemUrl"
            :src="previewUrl || produto.imagemUrl"
            alt="Pré-visualização"
            class="w-24 h-24 mt-4 rounded-lg border-2 border-[#04d1b0] object-cover shadow"
          />
        </div>

        <div class="flex justify-end pt-4 gap-4">
          <router-link to="/admin/products" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition">
            Cancelar
          </router-link>
          <button
            type="submit"
            class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
          >
            <i class="fas fa-save mr-2"></i>
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      produto: {
        nome: "",
        descricao: "",
        preco: null,
        imagem: null,
        imagemUrl: "",
        estoque: null,
        categoria: "",
      },
      previewUrl: null,
    };
  },
  methods: {
    async fetchProduct(productId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
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
        reader.onload = (e) => {
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
        formData.append("name", this.produto.nome);
        formData.append("description", this.produto.descricao);
        formData.append("price", this.produto.preco);
        if (this.produto.imagem) {
          formData.append("imagem", this.produto.imagem);
        }
        formData.append("stock", this.produto.estoque);
        formData.append("category", this.produto.categoria);

        await axios.put(`http://localhost:3000/api/products/${this.$route.params.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
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

/* Garante que o calendário do input de data também seja escuro em navegadores que suportam */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>