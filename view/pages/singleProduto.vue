<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200 py-10">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl mx-auto flex flex-col md:flex-row" v-if="product && product.name">
      <div class="w-full md:w-1/2 h-96 flex flex-col items-center justify-center overflow-hidden bg-gray-800 rounded-lg mb-6 md:mb-0 md:mr-6 p-4">
        <div class="relative group w-full h-72 flex items-center justify-center">
          <img
            class="object-contain max-h-72 w-full transition-transform duration-300 group-hover:scale-105 bg-gray-900 rounded-lg shadow"
            :src="getImageUrl(product.image)"
            :alt="product.name"
          />
          <span v-if="product.stock < 5" class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <i class="fas fa-exclamation-triangle mr-1"></i> Últimas unidades
          </span>
        </div>
      </div>
      <div class="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-[#04d1b0] mb-4 flex items-center gap-2">
            <i class="fas fa-box-open text-[#04d1b0]"></i> {{ product.name }}
          </h1>
          <div class="flex items-center gap-3 mb-2">
            <span class="bg-[#23272f] text-[#04d1b0] text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1">
              <i class="fas fa-tag"></i> {{ product.category }}
            </span>
          </div>
          <p class="text-gray-300 text-lg mb-6">{{ product.description }}</p>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <span class="text-3xl font-bold text-[#04d1b0] flex items-center gap-2">
            <i class="fas fa-money-bill-wave"></i> R${{ product.price ? product.price.toFixed(2) : '0.00' }}
          </span>
          <span :class="product.stock < 5 ? 'bg-red-600' : 'bg-[#04d1b0]'" class="text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1">
            <i class="fas fa-boxes"></i> {{ product.stock }} em estoque
          </span>
        </div>

        <div v-if="product.category === 'camisetas' && product.sizes && product.sizes.length > 0" class="mb-6">
            <label class="block text-gray-300 text-sm font-medium mb-2">Selecione o Tamanho:</label>
            <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  @click="selectSize(size)"
                  :class="[
                    'text-white text-sm font-semibold px-4 py-2 rounded-lg transition-transform transform hover:scale-105',
                    selectedSize === size ? 'bg-[#04d1b0] ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'bg-gray-700 hover:bg-gray-600'
                  ]"
                >
                    {{ size }}
                </button>
            </div>
        </div>

        <div class="mb-6">
          <label for="quantity" class="block text-gray-300 text-sm font-medium mb-2">Quantidade</label>
          <div class="flex items-center space-x-4">
            <button @click="decreaseQuantity" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-minus"></i></button>
            <input type="number" id="quantity" v-model.number="quantity" min="1" :max="product.stock" class="w-16 text-center bg-gray-800 text-gray-200 text-lg font-bold py-2 px-4 rounded-lg"/>
            <button @click="increaseQuantity" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-plus"></i></button>
          </div>
        </div>

        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <router-link to="/products" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2">
            <i class="fas fa-arrow-left"></i> Voltar
          </router-link>
          <button v-if="userType !== 'admin'" @click="toggleWishlist" class="font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
            :class="isInWishlist 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-red-600 hover:bg-red-500 text-white'">
            <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i> 
            {{ isInWishlist ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
          </button>
          <button v-if="userType !== 'admin'" @click="addToCart" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2">
            <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>

    <!-- Seção de Avaliações -->
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl mx-auto" v-if="product && product.name">
      <h2 class="text-3xl font-bold text-[#04d1b0] mb-6 flex items-center gap-3">
        <i class="fas fa-star"></i> Avaliações do Produto
      </h2>

      <!-- Formulário de Avaliação (apenas se usuário comprou OU está editando) -->
      <div v-if="userCanReview || isEditingReview" class="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 class="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <i :class="isEditingReview ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
          {{ isEditingReview ? 'Editar sua avaliação' : 'Deixe sua avaliação' }}
        </h3>
        <form @submit.prevent="submitReview" enctype="multipart/form-data">
          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Nota:</label>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="reviewForm.rating = star"
                class="text-3xl transition-colors"
                :class="star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'"
              >
                <i class="fas fa-star"></i>
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Comentário:</label>
            <textarea
              v-model="reviewForm.comment"
              class="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#04d1b0]"
              rows="4"
              placeholder="Conte sua experiência com o produto..."
              required
            ></textarea>
          </div>
          
          <!-- Upload de Imagens -->
          <div class="mb-4">
            <label class="flex items-center gap-2 text-gray-300 mb-2">
              <i class="fas fa-image"></i> Adicionar imagens (opcional, até 5 imagens):
            </label>
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              multiple
              class="w-full p-3 bg-gray-700 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#04d1b0] file:text-white file:cursor-pointer hover:file:bg-[#03b89a]"
            />
            
            <!-- Preview das imagens existentes (se estiver editando) -->
            <div v-if="reviewForm.existingImages && reviewForm.existingImages.length > 0" class="mt-4">
              <p class="text-gray-400 text-sm mb-2">Imagens atuais:</p>
              <div class="flex gap-2 flex-wrap">
                <div v-for="(image, idx) in reviewForm.existingImages" :key="idx" class="relative">
                  <img
                    :src="getImageUrl(image)"
                    class="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    @click="removeExistingImage(image)"
                    class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Preview das novas imagens -->
            <div v-if="reviewForm.imagePreviews && reviewForm.imagePreviews.length > 0" class="mt-4">
              <p class="text-gray-400 text-sm mb-2">Novas imagens:</p>
              <div class="flex gap-2 flex-wrap">
                <div v-for="(preview, idx) in reviewForm.imagePreviews" :key="idx" class="relative">
                  <img
                    :src="preview"
                    class="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    @click="removeNewImage(idx)"
                    class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <i :class="isEditingReview ? 'fas fa-save' : 'fas fa-paper-plane'"></i> 
              {{ isEditingReview ? 'Atualizar Avaliação' : 'Enviar Avaliação' }}
            </button>
            
            <button
              v-if="isEditingReview"
              type="button"
              @click="cancelEdit"
              class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
            >
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- Resumo por IA -->
      <div v-if="aiSummary && reviews.length > 0" class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg mb-6 border-l-4 border-purple-500">
        <h3 class="text-xl font-semibold mb-3 text-purple-300 flex items-center gap-2">
          <i class="fas fa-robot"></i> Resumo por IA
        </h3>
        <p class="text-gray-300">{{ aiSummary }}</p>
        <div v-if="sentimentStats" class="mt-4 flex gap-4">
          <div class="flex items-center gap-2">
            <i class="fas fa-thumbs-up text-green-400"></i>
            <span class="text-sm">{{ sentimentStats.percentages.positivo }}% Positivo</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-thumbs-down text-red-400"></i>
            <span class="text-sm">{{ sentimentStats.percentages.negativo }}% Negativo</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-minus-circle text-gray-400"></i>
            <span class="text-sm">{{ sentimentStats.percentages.neutro }}% Neutro</span>
          </div>
        </div>
      </div>

      <!-- Lista de Avaliações -->
      <div v-if="reviews.length > 0" class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review._id"
          class="bg-gray-800 p-6 rounded-lg"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-white">{{ review.user?.name || 'Usuário' }}</p>
              <div class="flex items-center gap-1 mt-1">
                <i
                  v-for="star in 5"
                  :key="star"
                  class="fas fa-star text-sm"
                  :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-600'"
                ></i>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-400 text-sm">
                {{ formatDate(review.createdAt) }}
              </span>
              <!-- Botões de ação (apenas para o próprio usuário) -->
              <div v-if="isUserReview(review)" class="flex items-center gap-2">
                <button
                  @click="editReview(review)"
                  class="text-[#04d1b0] hover:text-[#03b89a] transition"
                  title="Editar avaliação"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDeleteReview(review)"
                  class="text-red-500 hover:text-red-400 transition"
                  title="Excluir avaliação"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
          <p class="text-gray-300">{{ review.comment }}</p>
          <div v-if="review.images && review.images.length > 0" class="flex gap-2 mt-4 flex-wrap">
            <img
              v-for="(image, idx) in review.images"
              :key="idx"
              :src="getImageUrl(image)"
              class="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
              @click="openImageModal(image)"
            />
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 py-8">
        <i class="fas fa-comment-slash text-4xl mb-3"></i>
        <p>Este produto ainda não possui avaliações.</p>
      </div>
    </div>
  </div>
</template>

<script>
// --- A CORREÇÃO PRINCIPAL ESTÁ AQUI ---
import axios from "@/services/main.js"; // Importa a instância configurada do Axios!
import Swal from "sweetalert2";

export default {
  name: "SingleProduto",
  data() {
    return {
      product: { sizes: [] },
      quantity: 1,
      userType: "user",
      selectedSize: null,
      reviews: [],
      userCanReview: false,
      reviewForm: {
        rating: 5,
        comment: '',
        imageFiles: [],
        imagePreviews: [],
        existingImages: []
      },
      isEditingReview: false,
      aiSummary: '',
      sentimentStats: null,
      isInWishlist: false, // Adiciona controle de favorito
    };
  },
  async created() {
    const productId = this.$route.params.id;
    await this.fetchProduct(productId);
    await this.fetchReviews(productId);
    await this.checkIfUserCanReview(productId);
    await this.checkWishlistStatus(productId);
    
    const userDataRaw = localStorage.getItem("userData");
    if (userDataRaw && userDataRaw !== "undefined") {
      const userData = JSON.parse(userDataRaw);
      this.userType = userData.role || (userData.user && userData.user.role) || "user";
    }
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      const cleanPath = imagePath.replace(/^public[\\/]/, '');
      return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
    async fetchProduct(productId) {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        this.product = response.data;
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível encontrar os detalhes deste produto.',
          icon: 'error',
          background: '#1f2937',
          color: '#e5e7eb'
        }).then(() => {
            this.$router.push('/products');
        });
      }
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    async addToCart() {
      // --- DEBUG 1: Início da Função ---
      console.log('--- Iniciando addToCart ---');

      const token = localStorage.getItem('token');
      if (!token) {
          // --- DEBUG 2: Verificação de Token ---
          console.log('DEBUG: Usuário não logado. Redirecionando para /login.');
          Swal.fire({ title: 'Login Necessário', text: 'Você precisa fazer login para adicionar itens ao carrinho.', icon: 'info', background: "#1F2937", color: "#E5E7EB" })
              .then(() => this.$router.push('/login'));
          return;
      }

      if (this.product.category === 'camisetas' && !this.selectedSize) {
          // --- DEBUG 3: Verificação de Tamanho ---
          console.log('DEBUG: Categoria é camiseta, mas nenhum tamanho foi selecionado.');
          Swal.fire({ icon: 'warning', title: 'Tamanho não selecionado', text: 'Por favor, selecione um tamanho.', background: "#1F2937", color: "#E5E7EB" });
          return;
      }

      try {
          const cartItem = {
              productId: this.product._id,
              quantity: this.quantity,
              selectedSize: this.selectedSize,
              name: this.product.name,
              price: this.product.price,
              image: this.product.image
          };

          // --- DEBUG 4: Dados que serão enviados ---
          console.log('DEBUG: Preparando para enviar o seguinte item para a API:', cartItem);

          // Use a instância 'axios' que já tem o interceptor de token
          await axios.post('/api/cart/add', cartItem);

          // --- DEBUG 5: Sucesso na API ---
          console.log('DEBUG: API retornou sucesso. Exibindo SweetAlert.');

          Swal.fire({
              title: "Produto Adicionado!",
              text: `${this.quantity}x "${this.product.name}" foi adicionado.`,
              icon: "success",
              background: "#1F2937",
              color: "#E5E7EB",
              showCancelButton: true,
              confirmButtonText: "Ir para o Carrinho",
              cancelButtonText: "Continuar Comprando",
          }).then((result) => {
              if (result.isConfirmed) {
                  this.$router.push("/cart");
              }
          });
      } catch (error) {
          // --- DEBUG 6: Erro na API ---
          console.error('DEBUG: Erro ao chamar a API /api/cart/add.', error.response || error);
          Swal.fire({ title: 'Erro', text: 'Não foi possível adicionar o item ao carrinho.', icon: 'error', background: "#1F2937", color: "#E5E7EB" });
      }
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
    async fetchReviews(productId) {
      try {
        const response = await axios.get(`/api/products/${productId}/reviews`);
        this.reviews = response.data.reviews || [];
        
        // Gera resumo e análise de sentimento se houver avaliações
        if (this.reviews.length > 0) {
          await this.generateAISummary();
          await this.analyzeSentiments();
        }
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      }
    },
    async generateAISummary() {
      try {
        const comments = this.reviews.map(r => r.comment);
        const response = await axios.post('/api/ai/summary', { comments });
        this.aiSummary = response.data.summary;
      } catch (error) {
        console.error('Erro ao gerar resumo por IA:', error);
      }
    },
    async analyzeSentiments() {
      try {
        // Envia comentários com suas respectivas estrelas
        const reviewsData = this.reviews.map(r => ({
          comment: r.comment,
          rating: r.rating
        }));
        const response = await axios.post('/api/ai/sentiment-stats', { reviews: reviewsData });
        this.sentimentStats = response.data;
      } catch (error) {
        console.error('Erro ao analisar sentimentos:', error);
      }
    },
    async checkIfUserCanReview(productId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.userCanReview = false;
        return;
      }

      try {
        // Busca o histórico de pedidos do usuário
        const response = await axios.get('/api/orders/history');
        const orders = response.data;

        // Verifica se o usuário comprou e recebeu este produto
        const hasPurchased = orders.some(order => 
          order.status === 'Entregue' && 
          order.items.some(item => item.productId === productId)
        );

        // Verifica se o usuário já avaliou este produto
        const userDataRaw = localStorage.getItem("userData");
        let userId = null;
        if (userDataRaw && userDataRaw !== "undefined") {
          const userData = JSON.parse(userDataRaw);
          userId = userData.id || userData.user?.id;
        }

        const hasReviewed = this.reviews.some(review => 
          review.user?._id === userId
        );

        this.userCanReview = hasPurchased && !hasReviewed;
      } catch (error) {
        console.error('Erro ao verificar permissão de avaliação:', error);
        this.userCanReview = false;
      }
    },
    async submitReview() {
      if (!this.reviewForm.rating || !this.reviewForm.comment.trim()) {
        Swal.fire({
          title: 'Atenção',
          text: 'Por favor, preencha a nota e o comentário.',
          icon: 'warning',
          background: '#1f2937',
          color: '#e5e7eb'
        });
        return;
      }

      try {
        await axios.post(`/api/products/${this.product._id}/reviews`, {
          rating: this.reviewForm.rating,
          comment: this.reviewForm.comment,
          images: this.reviewForm.images
        });

        Swal.fire({
          title: 'Sucesso!',
          text: 'Sua avaliação foi enviada com sucesso!',
          icon: 'success',
          background: '#1f2937',
          color: '#e5e7eb'
        });

        // Recarrega as avaliações
        await this.fetchReviews(this.product._id);
        
        // Reseta o formulário
        this.reviewForm = { rating: 5, comment: '', images: [] };
        this.userCanReview = false;
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        Swal.fire({
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível enviar sua avaliação.',
          icon: 'error',
          background: '#1f2937',
          color: '#e5e7eb'
        });
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    },
    async fetchReviews(productId) {
      try {
        const response = await axios.get(`/api/products/${productId}/reviews`);
        this.reviews = response.data.reviews || [];
        
        // Gera resumo e análise de sentimento REAL com IA Gemini
        if (this.reviews.length > 0) {
          await this.generateAISummary();
          await this.analyzeSentiments();
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    },
    async checkIfUserCanReview(productId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.userCanReview = false;
        return;
      }
      try {
        // A rota de backend faz a verificação completa (compra + recebimento + não avaliou)
        const response = await axios.get(`/api/products/${productId}/can-review`);
        this.userCanReview = response.data.canReview;
      } catch (error) {
        // 401 ou 403, o usuário não está logado ou não tem permissão
        this.userCanReview = false;
        console.error("Erro ao verificar permissão de avaliação:", error);
      }
    },
    async submitReview() {
      const productId = this.$route.params.id;
      if (!this.reviewForm.comment || this.reviewForm.rating < 1) {
        Swal.fire({
          title: 'Atenção!',
          text: 'Por favor, preencha a nota e o comentário.',
          icon: 'warning',
          background: '#1f2937',
          color: '#e5e7eb'
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append('rating', this.reviewForm.rating);
        formData.append('comment', this.reviewForm.comment);
        
        // Adiciona as imagens ao FormData
        if (this.reviewForm.imageFiles && this.reviewForm.imageFiles.length > 0) {
          this.reviewForm.imageFiles.forEach(file => {
            formData.append('images', file);
          });
        }

        if (this.isEditingReview) {
          await axios.put(`/api/products/${productId}/review`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          Swal.fire({
            title: 'Atualizado!',
            text: 'Sua avaliação foi atualizada com sucesso!',
            icon: 'success',
            background: '#1f2937',
            color: '#e5e7eb'
          });
        } else {
          await axios.post(`/api/products/${productId}/review`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          Swal.fire({
            title: 'Sucesso!',
            text: 'Sua avaliação foi enviada com sucesso!',
            icon: 'success',
            background: '#1f2937',
            color: '#e5e7eb'
          });
        }

        // Recarrega e reseta
        this.reviewForm = { rating: 5, comment: '', imageFiles: [], imagePreviews: [], existingImages: [] };
        this.isEditingReview = false;
        await this.fetchReviews(productId);
        await this.checkIfUserCanReview(productId);

      } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        Swal.fire({
          title: 'Erro!',
          text: error.response?.data?.message || 'Não foi possível enviar sua avaliação.',
          icon: 'error',
          background: '#1f2937',
          color: '#e5e7eb'
        });
      }
    },
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      const maxFiles = 5;
      const currentTotal = (this.reviewForm.existingImages?.length || 0) + (this.reviewForm.imagePreviews?.length || 0) + files.length;
      if (currentTotal > maxFiles) {
        Swal.fire({ title: 'Limite excedido', text: `Você pode adicionar no máximo ${maxFiles} imagens.`, icon: 'warning', background: '#1f2937', color: '#e5e7eb' });
        return;
      }
      this.reviewForm.imageFiles.push(...files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => { this.reviewForm.imagePreviews.push(e.target.result); };
        reader.readAsDataURL(file);
      });
      event.target.value = '';
    },
    removeNewImage(index) {
      this.reviewForm.imageFiles.splice(index, 1);
      this.reviewForm.imagePreviews.splice(index, 1);
    },
    async removeExistingImage(imageUrl) {
      try {
        await axios.delete(`/api/products/${this.$route.params.id}/review/image`, { data: { imageUrl } });
        const index = this.reviewForm.existingImages.indexOf(imageUrl);
        if (index > -1) this.reviewForm.existingImages.splice(index, 1);
        Swal.fire({ title: 'Removida!', text: 'Imagem removida com sucesso.', icon: 'success', timer: 1500, showConfirmButton: false, background: '#1f2937', color: '#e5e7eb' });
        await this.fetchReviews(this.$route.params.id);
      } catch (error) {
        Swal.fire({ title: 'Erro', text: 'Não foi possível remover a imagem.', icon: 'error', background: '#1f2937', color: '#e5e7eb' });
      }
    },
    editReview(review) {
      console.log('editReview chamado com:', review);
      // Preenche o formulário com os dados da review
      this.reviewForm = {
        rating: review.rating,
        comment: review.comment,
        imageFiles: [],
        imagePreviews: [],
        existingImages: review.images || []
      };
      this.isEditingReview = true;
      console.log('reviewForm atualizado:', this.reviewForm);
      console.log('isEditingReview:', this.isEditingReview);
      
      // Scrolla até o formulário
      this.$nextTick(() => {
        const form = document.querySelector('.bg-gray-800');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
    cancelEdit() {
      this.reviewForm = { rating: 5, comment: '', imageFiles: [], imagePreviews: [], existingImages: [] };
      this.isEditingReview = false;
    },
    async confirmDeleteReview(review) {
      const result = await Swal.fire({
        title: 'Excluir avaliação?',
        html: `Tem certeza que deseja remover sua avaliação deste produto?<br><br><strong>Esta ação não pode ser desfeita.</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-trash mr-2"></i> Sim, excluir!',
        cancelButtonText: '<i class="fas fa-times mr-2"></i> Cancelar',
        background: '#1f2937',
        color: '#e5e7eb',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        await this.deleteReview();
      }
    },
    async deleteReview() {
      try {
        console.log('Tentando excluir review do produto:', this.$route.params.id);
        const response = await axios.delete(`/api/products/${this.$route.params.id}/review`);
        console.log('Resposta do servidor:', response.data);
        
        Swal.fire({
          title: 'Excluída!',
          text: 'Sua avaliação foi removida com sucesso.',
          icon: 'success',
          background: '#1f2937',
          color: '#e5e7eb',
          timer: 2000,
          showConfirmButton: false
        });

        // Recarrega as avaliações e verifica se pode avaliar novamente
        await this.fetchReviews(this.$route.params.id);
        await this.checkIfUserCanReview(this.$route.params.id);
        
        // Se estava editando, cancela a edição
        if (this.isEditingReview) {
          this.cancelEdit();
        }
      } catch (error) {
        console.error('Erro detalhado ao excluir avaliação:', error);
        console.error('Response error:', error.response);
        Swal.fire({
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível excluir sua avaliação.',
          icon: 'error',
          background: '#1f2937',
          color: '#e5e7eb'
        });
      }
    },
    isUserReview(review) {
      const userDataRaw = localStorage.getItem("userData");
      if (!userDataRaw || userDataRaw === "undefined") {
        console.log('isUserReview: Sem dados de usuário no localStorage');
        return false;
      }
      
      const userData = JSON.parse(userDataRaw);
      const userId = userData.id || userData._id;
      const reviewUserId = typeof review.user === 'object' ? (review.user._id || review.user.id) : review.user;
      
      console.log('isUserReview - userId:', userId);
      console.log('isUserReview - reviewUserId:', reviewUserId);
      console.log('isUserReview - são iguais?:', String(userId) === String(reviewUserId));
      
      return String(userId) === String(reviewUserId);
    },
    openImageModal(image) {
      const imageUrl = this.getImageUrl(image);
      Swal.fire({
        imageUrl: imageUrl,
        imageAlt: 'Imagem da avaliação',
        showCloseButton: true,
        showConfirmButton: false,
        background: '#1f2937',
        customClass: { image: 'max-h-96 object-contain' }
      });
    },
    async checkWishlistStatus(productId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.isInWishlist = false;
        return;
      }

      try {
        const response = await axios.get(`/api/wishlist/check/${productId}`);
        this.isInWishlist = response.data.inWishlist;
      } catch (error) {
        console.error('Erro ao verificar status da wishlist:', error);
        this.isInWishlist = false;
      }
    },
    async toggleWishlist() {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          title: 'Login Necessário',
          text: 'Você precisa fazer login para adicionar aos favoritos.',
          icon: 'info',
          background: "#1F2937",
          color: "#E5E7EB"
        }).then(() => this.$router.push('/login'));
        return;
      }

      const productId = this.$route.params.id;

      try {
        if (this.isInWishlist) {
          // Remove dos favoritos
          await axios.delete(`/api/wishlist/remove/${productId}`);
          this.isInWishlist = false;
          
          Swal.fire({
            title: "Removido dos Favoritos!",
            icon: "info",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: "#1F2937",
            color: "#E5E7EB",
          });
        } else {
          // Adiciona aos favoritos
          await axios.post('/api/wishlist/add', { productId });
          this.isInWishlist = true;

          Swal.fire({
            title: "Adicionado aos Favoritos!",
            icon: "success",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: "#1F2937",
            color: "#E5E7EB",
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar wishlist:', error);
        const message = error.response?.data?.message || 'Não foi possível atualizar os favoritos.';
        Swal.fire({
          title: 'Erro',
          text: message,
          icon: 'error',
          background: "#1F2937",
          color: "#E5E7EB"
        });
      }
    },
    async addToWishlist() {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          title: 'Atenção!',
          text: 'Você precisa fazer login para adicionar produtos aos favoritos.',
          icon: 'warning',
          background: '#1f2937',
          color: '#e5e7eb'
        });
        return;
      }

      try {
        await api.post('/api/wishlist/add', {
          productId: this.$route.params.id
        });

        Swal.fire({
          title: 'Sucesso!',
          text: 'Produto adicionado à lista de desejos!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#e5e7eb'
        });
      } catch (error) {
        console.error("Erro ao adicionar à wishlist:", error);
        Swal.fire({
          title: 'Erro!',
          text: error.response?.data?.message || 'Não foi possível adicionar aos favoritos.',
          icon: 'error',
          background: '#1f2937',
          color: '#e5e7eb'
        });
      }
    }
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>