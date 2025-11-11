# 🔄 ALTERAÇÕES PARA IMPLEMENTAR WISHLIST

## 📝 RESUMO
Este documento lista todas as alterações necessárias para adicionar a funcionalidade Wishlist ao projeto DevLooks.

---

## 📂 ARQUIVOS A CRIAR

### 1. Backend

#### `/server/controllers/WishlistController.ts`
```typescript
import { Request, Response, RequestHandler } from 'express';
import UserModel from '../models/UserModel';
import ProductModel from '../models/ProductModel';

class WishlistController {
    static addToWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.body;

            if (!productId) {
                res.status(400).json({ message: 'ID do produto é obrigatório' });
                return;
            }

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

            const wishlist = user.wishlist || [];
            const productIndex = wishlist.findIndex(id => id.toString() === productId);

            if (productIndex !== -1) {
                res.status(400).json({ message: 'Produto já está na lista de desejos' });
                return;
            }

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

    static removeFromWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.params;

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

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

#### `/server/routes/WishlistRoutes.ts`
```typescript
import { Router } from 'express';
import WishlistController from '../controllers/WishlistController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', WishlistController.getWishlist);
router.post('/', WishlistController.addToWishlist);
router.delete('/:productId', WishlistController.removeFromWishlist);
router.get('/check/:productId', WishlistController.isInWishlist);

export default router;
```

### 2. Frontend

Ver arquivo `WISHLIST_FRONTEND.md` para o código completo do componente Vue.

---

## 📝 ARQUIVOS A MODIFICAR

### 1. `/server/models/UserModel.ts`

**Adicionar na interface IUser:**
```typescript
wishlist?: Schema.Types.ObjectId[];
```

**Adicionar no UserSchema:**
```typescript
wishlist: { type: [Schema.Types.ObjectId], ref: 'Product', default: [] },
```

### 2. `/server/index.ts`

**Adicionar import:**
```typescript
import wishlistRoutes from './routes/WishlistRoutes';
```

**Adicionar rota:**
```typescript
app.use('/api/wishlist', wishlistRoutes);
```

### 3. `/view/router.js`

**Adicionar import:**
```typescript
import Wishlist from './pages/Wishlist.vue';
```

**Adicionar rota:**
```typescript
{ path: '/wishlist', component: Wishlist, meta: { requiresAuth: true } },
```

### 4. `/view/components/Header.vue`

**Adicionar antes do carrinho (linha ~53):**
```vue
<router-link to="/wishlist" class="relative hover:text-emerald-400 transition-colors" aria-label="Lista de Desejos" title="Lista de Desejos">
  <i class="fas fa-heart text-xl"></i>
</router-link>
```

---

## 🚀 COMO APLICAR AS MUDANÇAS

1. **Crie os novos arquivos** listados acima
2. **Modifique os arquivos** existentes com as alterações indicadas
3. **Execute:**
   ```bash
   npm install  # Para garantir que as dependências estão ok
   npm run build  # Para testar se compila
   ```

4. **Teste a funcionalidade:**
   - Faça login
   - Clique no ícone de coração no header
   - Vá para `/wishlist`

---

## 📊 CHECKLIST

- [ ] Criar `WishlistController.ts`
- [ ] Criar `WishlistRoutes.ts`
- [ ] Criar `Wishlist.vue`
- [ ] Modificar `UserModel.ts`
- [ ] Modificar `server/index.ts`
- [ ] Modificar `view/router.js`
- [ ] Modificar `Header.vue`
- [ ] Testar build (`npm run build`)
- [ ] Testar funcionalidade

---

## ❓ DÚVIDAS?

Consulte os documentos criados:
- `ANALISE_COMPLETA_TP4.md` - Análise detalhada
- `TP4_ENTREGA_FINAL.md` - Visão geral
- `GUIA_DEMONSTRACAO_TP4.md` - Roteiro de apresentação
