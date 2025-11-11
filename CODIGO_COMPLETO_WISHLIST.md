# 💻 CÓDIGO COMPLETO - WISHLIST

## 📁 ARQUIVO 1: WishlistController.ts

**Caminho:** `server/controllers/WishlistController.ts`

```typescript
import { Request, Response, RequestHandler } from 'express';
import UserModel from '../models/UserModel';
import ProductModel from '../models/ProductModel';

class WishlistController {
    /**
     * Adiciona um produto à wishlist do usuário
     */
    static addToWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.body;

            if (!productId) {
                res.status(400).json({ message: 'ID do produto é obrigatório' });
                return;
            }

            // Verifica se o produto existe
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

            // Verifica se o produto já está na wishlist
            const wishlist = user.wishlist || [];
            const productIndex = wishlist.findIndex(id => id.toString() === productId);

            if (productIndex !== -1) {
                res.status(400).json({ message: 'Produto já está na lista de desejos' });
                return;
            }

            // Adiciona o produto à wishlist
            wishlist.push(productId);
            user.wishlist = wishlist;
            await user.save();

            res.status(200).json({
                message: 'Produto adicionado à lista de desejos',
                wishlist: wishlist
            });

        } catch (error: any) {
            console.error('Erro ao adicionar produto à wishlist:', error);
            res.status(500).json({
                message: 'Erro ao adicionar produto à lista de desejos',
                error: error.message
            });
        }
    };

    /**
     * Remove um produto da wishlist do usuário
     */
    static removeFromWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.params;

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

            // Remove o produto da wishlist
            const wishlist = user.wishlist || [];
            user.wishlist = wishlist.filter(id => id.toString() !== productId);
            await user.save();

            res.status(200).json({
                message: 'Produto removido da lista de desejos',
                wishlist: user.wishlist
            });

        } catch (error: any) {
            console.error('Erro ao remover produto da wishlist:', error);
            res.status(500).json({
                message: 'Erro ao remover produto da lista de desejos',
                error: error.message
            });
        }
    };

    /**
     * Retorna a wishlist do usuário com os dados completos dos produtos
     */
    static getWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;

            const user = await UserModel.findById(userId).populate('wishlist');
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

            res.status(200).json({
                wishlist: user.wishlist || []
            });

        } catch (error: any) {
            console.error('Erro ao buscar wishlist:', error);
            res.status(500).json({
                message: 'Erro ao buscar lista de desejos',
                error: error.message
            });
        }
    };

    /**
     * Verifica se um produto está na wishlist do usuário
     */
    static isInWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.params;

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

            const wishlist = user.wishlist || [];
            const isInWishlist = wishlist.some(id => id.toString() === productId);

            res.status(200).json({
                isInWishlist: isInWishlist
            });

        } catch (error: any) {
            console.error('Erro ao verificar wishlist:', error);
            res.status(500).json({
                message: 'Erro ao verificar lista de desejos',
                error: error.message
            });
        }
    };
}

export default WishlistController;
```

---

## 📁 ARQUIVO 2: WishlistRoutes.ts

**Caminho:** `server/routes/WishlistRoutes.ts`

```typescript
import { Router } from 'express';
import WishlistController from '../controllers/WishlistController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas de wishlist requerem autenticação
router.use(authMiddleware);

// GET /api/wishlist - Retorna a wishlist do usuário
router.get('/', WishlistController.getWishlist);

// POST /api/wishlist - Adiciona produto à wishlist
router.post('/', WishlistController.addToWishlist);

// DELETE /api/wishlist/:productId - Remove produto da wishlist
router.delete('/:productId', WishlistController.removeFromWishlist);

// GET /api/wishlist/check/:productId - Verifica se produto está na wishlist
router.get('/check/:productId', WishlistController.isInWishlist);

export default router;
```

---

## 📁 ARQUIVO 3: Wishlist.vue

**Caminho:** `view/pages/Wishlist.vue`

```vue
<template>
  <div class="min-h-screen bg-gray-900 py-8 px-4">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-[#04d1b0] mb-4 flex items-center justify-center gap-3">
          <i class="fas fa-heart"></i>
          Minha Lista de Desejos
        </h1>
        <p class="text-gray-400 text-lg">Produtos que você deseja comprar</p>
      </div>

      <div v-if="loading" class="text-center py-20">
        <i class="fas fa-spinner fa-spin text-4xl text-[#04d1b0]"></i>
        <p class="mt-4 text-lg text-gray-300">Carregando sua lista...</p>
      </div>

      <div v-else-if="wishlist.length === 0" class="text-center py-20">
        <div class="bg-gray-800 rounded-xl shadow-2xl p-10 border border-gray-700 max-w-lg mx-auto">
          <i class="fas fa-heart-broken text-5xl text-gray-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-white mb-4">Sua lista está vazia</h2>
          <p class="text-gray-400 text-lg mb-8">
            Adicione produtos à sua lista de desejos para encontrá-los facilmente depois!
          </p>
          <router-link to="/products" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 inline-flex items-center gap-2">
            <i class="fas fa-shopping-bag"></i>
            Explorar Produtos
          </router-link>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in wishlist" :key="product._id" class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden transition-transform duration-300 hover:scale-105 hover:border-[#04d1b0]">
          <div class="relative">
            <img :src="getProductImage(product)" :alt="product.name" class="w-full h-64 object-cover">
            <button @click="removeFromWishlist(product._id)" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110" title="Remover da lista">
              <i class="fas fa-heart-broken"></i>
            </button>
          </div>

          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">{{ product.name }}</h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-3">{{ product.description }}</p>

            <div class="flex items-center justify-between mb-4">
              <div>
                <span v-if="product.promotion_price" class="text-gray-500 line-through text-sm mr-2">
                  R$ {{ product.price.toFixed(2) }}
                </span>
                <span class="text-[#04d1b0] text-2xl font-bold">
                  R$ {{ (product.promotion_price || product.price).toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <router-link :to="`/product/${product._id}`" class="flex-1 bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg text-center transition duration-300">
                <i class="fas fa-eye mr-2"></i>Ver Detalhes
              </router-link>
              <button @click="addToCart(product)" class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300" title="Adicionar ao carrinho">
                <i class="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/main';
import Swal from 'sweetalert2';

export default {
  name: 'Wishlist',
  data() {
    return {
      wishlist: [],
      loading: true
    };
  },
  async created() {
    await this.loadWishlist();
  },
  methods: {
    async loadWishlist() {
      this.loading = true;
      try {
        const response = await api.get('/api/wishlist');
        this.wishlist = response.data.wishlist || [];
      } catch (error) {
        console.error('Erro ao carregar wishlist:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar sua lista de desejos',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      } finally {
        this.loading = false;
      }
    },
    async removeFromWishlist(productId) {
      try {
        const result = await Swal.fire({
          icon: 'question',
          title: 'Remover da lista?',
          text: 'Deseja remover este produto da sua lista de desejos?',
          showCancelButton: true,
          confirmButtonText: 'Sim, remover',
          cancelButtonText: 'Cancelar',
          background: '#1F2937',
          color: '#E5E7EB',
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280'
        });

        if (result.isConfirmed) {
          await api.delete(`/api/wishlist/${productId}`);
          this.wishlist = this.wishlist.filter(p => p._id !== productId);

          Swal.fire({
            icon: 'success',
            title: 'Removido!',
            text: 'Produto removido da lista de desejos',
            timer: 2000,
            showConfirmButton: false,
            background: '#1F2937',
            color: '#E5E7EB'
          });
        }
      } catch (error) {
        console.error('Erro ao remover da wishlist:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível remover o produto',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      }
    },
    async addToCart(product) {
      try {
        await api.post('/api/cart/add', {
          productId: product._id,
          quantity: 1
        });

        Swal.fire({
          icon: 'success',
          title: 'Adicionado!',
          text: 'Produto adicionado ao carrinho',
          timer: 2000,
          showConfirmButton: false,
          background: '#1F2937',
          color: '#E5E7EB'
        });
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível adicionar ao carrinho',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      }
    },
    getProductImage(product) {
      if (product.image && product.image.startsWith('http')) {
        return product.image;
      }
      return `http://localhost:3000${product.image}`;
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
```

---

## ✏️ MODIFICAÇÕES EM ARQUIVOS EXISTENTES

### 1. UserModel.ts

Adicione na interface IUser (linha ~28):
```typescript
wishlist?: Schema.Types.ObjectId[];
```

Adicione no UserSchema (linha ~92):
```typescript
wishlist: { type: [Schema.Types.ObjectId], ref: 'Product', default: [] },
```

### 2. server/index.ts

Adicione o import (linha ~26):
```typescript
import wishlistRoutes from './routes/WishlistRoutes';
```

Adicione a rota (linha ~58):
```typescript
app.use('/api/wishlist', wishlistRoutes);
```

### 3. view/router.js

Adicione o import (linha ~31):
```typescript
import Wishlist from './pages/Wishlist.vue';
```

Adicione a rota (linha ~50):
```typescript
{ path: '/wishlist', component: Wishlist, meta: { requiresAuth: true } },
```

### 4. view/components/Header.vue

Adicione antes do link do carrinho (linha ~53):
```vue
<router-link to="/wishlist" class="relative hover:text-emerald-400 transition-colors" aria-label="Lista de Desejos" title="Lista de Desejos">
  <i class="fas fa-heart text-xl"></i>
</router-link>
```

---

## 🚀 PASSOS FINAIS

1. Copie os 3 novos arquivos para seus respectivos diretórios
2. Faça as modificações nos 4 arquivos existentes
3. Execute: `npm run build`
4. Teste acessando `/wishlist`

✅ **Pronto!** A funcionalidade Wishlist estará implementada!
