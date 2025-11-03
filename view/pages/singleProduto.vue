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

      <!-- Formulário de Avaliação (apenas se usuário comprou) -->
      <div v-if="userCanReview" class="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 class="text-xl font-semibold mb-4 text-white">Deixe sua avaliação</h3>
        <form @submit.prevent="submitReview">
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
          <button
            type="submit"
            class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <i class="fas fa-paper-plane"></i> Enviar Avaliação
          </button>
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
            <span class="text-gray-400 text-sm">
              {{ formatDate(review.createdAt) }}
            </span>
          </div>
          <p class="text-gray-300">{{ review.comment }}</p>
          <div v-if="review.images && review.images.length > 0" class="flex gap-2 mt-4">
            <img
              v-for="(image, idx) in review.images"
              :key="idx"
              :src="getImageUrl(image)"
              class="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
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
        images: []
      },
      aiSummary: '',
      sentimentStats: null
    };
  },
  async created() {
    const productId = this.$route.params.id;
    await this.fetchProduct(productId);
    await this.fetchReviews(productId);
    await this.checkIfUserCanReview(productId);
    
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
        const comments = this.reviews.map(r => r.comment);
        const response = await axios.post('/api/ai/sentiment-stats', { comments });
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
    openImageModal(image) {
      // Abre a imagem em uma modal ou nova aba
      window.open(this.getImageUrl(image), '_blank');
    }
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>