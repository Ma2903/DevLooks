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
          <input type="text" id="nome" v-model="produto.name" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" required />
        </div>
        <div>
          <label for="descricao" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Descrição</label>
          <textarea id="descricao" v-model="produto.description" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" required></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="preco" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Preço</label>
            <input type="number" id="preco" v-model="produto.price" step="0.01" min="0" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" required />
          </div>
          <div>
            <label for="estoque" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Estoque</label>
            <input type="number" id="estoque" v-model="produto.stock" min="0" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" required />
          </div>
        </div>
        <div>
          <label for="categoria" class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Categoria</label>
          <select id="categoria" v-model="produto.category" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition" required>
            <option value="" disabled>Selecione uma categoria</option>
            <option value="camisetas">Camisetas</option>
            <option value="canecas">Canecas</option>
            <option value="acessorios">Acessórios</option>
            <option value="presentes">Presentes</option>
             <option value="avatares">Avatares</option>
            <option value="skins">Skins</option>
          </select>
        </div>
         <div v-if="produto.category === 'camisetas'">
          <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Tamanhos Disponíveis</label>
          <div class="flex flex-wrap gap-x-6 gap-y-2">
            <div v-for="tamanho in todosOsTamanhos" :key="tamanho" class="flex items-center">
              <input
                type="checkbox"
                :id="`size-${tamanho}`"
                :value="tamanho"
                v-model="produto.sizes"
                class="h-5 w-5 bg-gray-700 border-gray-600 rounded text-[#04d1b0] focus:ring-[#04d1b0]"
              />
              <label :for="`size-${tamanho}`" class="ml-2 text-gray-300">{{ tamanho }}</label>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Imagem do Produto</label>
          <div v-if="produto.image && !previewUrl" class="mb-2">
            <p class="text-xs text-gray-400 mb-1">Imagem Atual:</p>
            <img :src="getImageUrl(produto.image)" alt="Imagem atual" class="w-24 h-24 rounded-lg border-2 border-gray-500 object-cover shadow"/>
          </div>
          <img v-if="previewUrl" :src="previewUrl" alt="Pré-visualização da nova imagem" class="w-24 h-24 mb-2 rounded-lg border-2 border-[#04d1b0] object-cover shadow"/>
          <input
            type="file"
            id="imagem"
            @change="onFileChange"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
            accept="image/*"
          />
        </div>

        <div class="flex justify-end pt-4 gap-4">
          <router-link to="/admin/products" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition">
            Cancelar
          </router-link>
          <button type="submit" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition">
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
      // Inicializa o produto com todos os campos esperados
      produto: {
        name: "",
        description: "",
        price: null,
        image: null, // Guardará o caminho da imagem existente
        stock: null,
        category: "",
        sizes: []
      },
      todosOsTamanhos: ['P', 'M', 'G', 'GG', 'XG'],
      newImageFile: null, // Guarda o NOVO arquivo de imagem selecionado
      previewUrl: null, // Guarda a URL de pré-visualização da NOVA imagem
    };
  },
  methods: {
    // FUNÇÃO CORRIGIDA E PADRONIZADA
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      const cleanPath = imagePath.replace(/^public[\\/]/, '');
      return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
    async fetchProduct(productId) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Garante que 'sizes' seja sempre um array
        response.data.sizes = response.data.sizes || [];
        this.produto = response.data;
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (!file) {
        this.newImageFile = null;
        this.previewUrl = null;
        return;
      }
      this.newImageFile = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    async editarProduto() {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        // Anexa todos os dados de texto
        formData.append('name', this.produto.name);
        formData.append('description', this.produto.description);
        formData.append('price', this.produto.price);
        formData.append('stock', this.produto.stock);
        formData.append('category', this.produto.category);

        // Anexa o array de tamanhos
        if (this.produto.sizes && this.produto.sizes.length > 0) {
          this.produto.sizes.forEach(size => formData.append('sizes', size));
        } else {
          formData.append('sizes', ''); // Envia vazio para limpar no banco
        }

        // Anexa a NOVA imagem SOMENTE se uma foi selecionada
        if (this.newImageFile) {
          formData.append('imagem', this.newImageFile);
        }

        await axios.put(`http://localhost:3000/api/products/${this.$route.params.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        Swal.fire({ icon: "success", title: "Sucesso!", text: "Produto editado com sucesso!", background: "#1F2937", color: "#E5E7EB" })
          .then(() => {
            this.$router.push("/admin/products");
          });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Erro", text: "Erro ao editar produto.", background: "#1F2937", color: "#E5E7EB" });
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
</style>