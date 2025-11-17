# 📋 Changelog - DevLooks

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.5.0] - 2025-11-17

### ✨ Adicionado
- **Páginas Institucionais**
  - Página "Sobre o Projeto" (`/project`) com tecnologias utilizadas e objetivos acadêmicos
  - Política de Privacidade (`/privacy`) detalhando tratamento de dados
  - Termos de Uso (`/terms`) com avisos sobre natureza acadêmica do projeto
  
- **Aviso Legal no Rodapé**
  - Banner destacado informando que é um projeto acadêmico
  - Links diretos para páginas institucionais
  - Design com gradiente e ícones para melhor visibilidade

- **Melhorias de UX/UI**
  - Botões de favoritos aumentados (44x44px) para melhor touch em mobile
  - Classe `touch-manipulation` para otimização de interações touch
  - Animações de hover melhoradas (scale e heart-beat)
  - ARIA labels adicionados para acessibilidade

- **Performance e Otimizações**
  - Componente `LazyImage.vue` com Intersection Observer para lazy loading
  - Arquivo `main.css` expandido com animações e microinterações
  - Hardware acceleration (`transform: translateZ(0)`)
  - Skeleton loading para imagens durante carregamento

- **Animações CSS**
  - `fadeIn`, `fadeInUp`, `scaleIn`, `slideInRight`
  - `heartBeat` para botão de favoritos
  - `skeleton-loading` para placeholders
  - `toast-slide-in` para notificações
  - Efeito ripple (Material Design) para botões

### 🔧 Corrigido
- **Problema: Pedidos não salvavam no banco após pagamento**
  - Causa: Incompatibilidade entre schema do `OrderModel` e dados do `PaymentController`
  - Solução: Schema atualizado para aceitar campos `paymentMethod`, `paymentStatus`, `mercadoPagoPaymentId`
  - Adicionados status novos: `'paid'`, `'pending'`, `'cancelled'`, `'refunded'`
  - `PaymentController` agora popula todos os campos necessários (name, image, selectedSize)

- **Problema: Cupons não aplicavam desconto no Mercado Pago**
  - Causa: Desconto calculado mas não enviado ao MP
  - Solução: Desconto adicionado como item negativo em `items_for_mp`
  - Agora o desconto aparece discriminado no checkout do Mercado Pago

- **Problema: IA classificava sentimentos incorretamente**
  - Causa: Lógica priorizava estrelas sobre análise do texto
  - Solução: IA sempre analisa o texto primeiro, estrelas usadas apenas como desempate
  - Texto negativo/positivo sempre prevalece sobre rating de estrelas

- **Problema: Botão de favoritos invisível no mobile**
  - Causa: Tamanho pequeno (40x40px) e contraste baixo
  - Solução: Aumentado para 48x48px com melhor contraste e hover effects

### 📝 Atualizado
- **README.md**
  - Seção sobre projeto acadêmico destacada no topo
  - Tecnologias expandidas (Gemini AI, Mercado Pago SDK, etc.)
  - Adicionada seção "Melhorias de UX/UI Implementadas"
  - Funcionalidades detalhadas (wishlist, IA, notificações)

- **Router (`router.js`)**
  - Rotas adicionadas: `/project`, `/privacy`, `/terms`
  - Imports dos novos componentes

- **Footer (`Footer.vue`)**
  - Aviso legal sobre projeto acadêmico
  - Links para páginas institucionais
  - Design atualizado com gradiente e ícones

- **Componentes de Produto**
  - Botões de favoritos com tamanho aumentado
  - Animação de heart-beat ao clicar
  - Melhor feedback visual

### 🎨 Melhorado
- **Microinterações**
  - Transições suaves entre estados
  - Feedback visual imediato em ações
  - Animações com timing functions otimizadas

- **Acessibilidade**
  - Focus visível para navegação por teclado
  - ARIA labels em elementos interativos
  - Contraste de cores melhorado

- **Performance**
  - Lazy loading de imagens
  - Skeleton screens durante carregamento
  - Otimização de animações com will-change

---

## [1.4.0] - Versões Anteriores

### Funcionalidades Principais Implementadas
- Sistema completo de autenticação (JWT + bcrypt)
- CRUD de produtos, usuários, pedidos e cupons
- Integração com Mercado Pago (sandbox)
- Criação de avatares com IA
- Análise de sentimentos em reviews com Gemini AI
- Sistema de notificações em tempo real
- Cálculo de frete por CEP
- Carrinho e wishlist funcional
- Painel administrativo completo

---

## 🔜 Próximas Melhorias Planejadas

### Fase 2 (Média Prioridade)
- [ ] Busca interna com autocomplete
- [ ] Filtros avançados de produtos
- [ ] Página de erro personalizada (404/500)
- [ ] Sistema de reviews melhorado
- [ ] Testes automatizados

### Fase 3 (Baixa Prioridade)
- [ ] PWA (Progressive Web App)
- [ ] Modo offline básico
- [ ] Testes A/B
- [ ] Monitoramento com logs estruturados
- [ ] Internacionalização (i18n)

---

**Formato do versionamento:** [MAJOR.MINOR.PATCH]
- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades novas compatíveis
- **PATCH**: Correções de bugs
