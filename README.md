# 🛍️ DevLooks E-commerce

![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square&logo=node.js)
![Git](https://img.shields.io/badge/Git-Repo-blue?style=flat-square&logo=git)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square&logo=mongodb)
![Build](https://img.shields.io/badge/Build-Passing-success?style=flat-square&logo=githubactions)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square&logo=open-source-initiative)

---

## 🎓 Projeto Acadêmico

> **Importante**: Este é um **projeto acadêmico** desenvolvido para fins de aprendizado e demonstração de habilidades em desenvolvimento web full-stack. Embora utilize tecnologias reais (incluindo integração com API do Mercado Pago), **não representa um negócio comercial real com estoque físico**.

**DevLooks** é uma plataforma de e-commerce full-stack, desenvolvida do zero e voltada para o público de tecnologia.  
O projeto permite que programadores expressem seu estilo através da compra simulada de produtos como camisetas, acessórios e itens de setup, além de contar com um sistema exclusivo para criação de avatares personalizados com IA.

A aplicação foi construída com foco em uma experiência de usuário moderna e uma arquitetura robusta, separando claramente as responsabilidades entre front-end e back-end.

---

## ✨ Funcionalidades Principais

O projeto conta com um sistema completo, incluindo funcionalidades para clientes e para administração.

### 👥 Para Clientes
- **Autenticação de Usuários:** Sistema completo de cadastro e login com tokens JWT.  
- **Catálogo de Produtos:** Navegação por produtos com filtros por categoria e busca por nome/descrição.  
- **Lista de Favoritos (Wishlist):** Salvar produtos favoritos para comprar depois.
- **Carrinho de Compras:** Adição, remoção e atualização de quantidade de itens.  
- **Criação de Avatares com IA:** Ferramenta para personalizar e salvar avatares únicos usando Google Gemini AI.  
- **Sistema de Cupons:** Aplicação de cupons de desconto (valor fixo ou porcentagem).  
- **Checkout Completo:** Processo de finalização de compra com cálculo de frete e integração de pagamento via **Mercado Pago**.  
- **Histórico de Pedidos:** Área para o usuário visualizar suas compras anteriores.
- **Avaliações com IA:** Sistema de reviews com análise de sentimento automatizada usando Gemini AI.
- **Notificações:** Sistema de notificações em tempo real sobre pedidos e promoções.

### 🛠️ Painel de Administração
- **Gerenciamento de Produtos (CRUD):** Adicionar, visualizar, editar e remover produtos com upload de múltiplas imagens.  
- **Gerenciamento de Usuários:** Visualização e alteração de permissões de usuários.  
- **Gerenciamento de Pedidos:** Acompanhamento e atualização do status dos pedidos.  
- **Gerenciamento de Cupons:** Criação e administração de cupons de desconto com datas de validade.
- **Dashboard com Estatísticas:** Visão geral de vendas, produtos mais vendidos e análise de reviews.  

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com uma arquitetura moderna, utilizando as seguintes tecnologias:

### **Front-End**
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### **Back-End**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

### **Integrações e APIs**
- **Mercado Pago SDK v2** - Gateway de pagamento funcional
- **Google Gemini AI** - Análise de sentimentos e resumo de avaliações
- **Nodemailer** - Envio de emails para recuperação de senha
- **bcrypt** - Criptografia de senhas
- **JWT** - Autenticação stateless

### **Deploy e Hospedagem**
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### **Ferramentas e Outros**
- **SweetAlert2** - Modais e notificações elegantes
- **Padrões de Design**: Factory Pattern, Observer Pattern
- **Arquitetura MVC** - Separação de responsabilidades

---

## 📦 Rodando o Projeto Localmente

Siga os passos abaixo para executar o projeto em sua máquina.

### 🔧 Pré-requisitos
- **Node.js** (v22 ou superior)  
- **Git**  
- Uma instância do **MongoDB** (local ou em nuvem, como o MongoDB Atlas)  

### 1. Clonando o Repositório
```bash
git clone https://github.com/Ma2903/DevLooks.git
cd DevLooks
````

### 2. Configurando o Back-end

O back-end precisa de um arquivo de configuração para se conectar ao banco de dados e para outras variáveis de ambiente.

Crie um arquivo chamado **.env** na raiz do projeto e copie o conteúdo abaixo, substituindo os valores `SUA_VARIAVEL` pelas suas próprias chaves:

```env
# Conexão com o Banco de Dados
MONGO_URI=SUA_STRING_DE_CONEXAO_MONGODB

# Segredos para autenticação
JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO_PARA_JWT
CRYPTO_SECRET=SEU_SEGREDO_PARA_CRIPTOGRAFIA

# Configuração de E-mail (usado para recuperação de senha)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=seu_email@example.com
MAIL_PASS=sua_senha_de_email
OWNER_EMAIL=email_do_dono_para_testes@example.com

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DO_MERCADO_PAGO

# Google Gemini AI
GEMINI_API_KEY=SUA_CHAVE_API_DO_GEMINI

# CEP de origem para cálculo de frete
CORREIOS_CEP_ORIGEM=SEU_CEP_DE_ORIGEM
```

> **Nota sobre Mercado Pago**: A integração está ativa. Tenha cuidado ao processar pagamentos, pois são transações reais.

### 3. Instalação e Execução

Você precisará de **dois terminais** abertos no diretório do projeto.

#### 🖥️ Terminal 1: Rodando o Back-end (Servidor)

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm run server
```

O servidor estará rodando em **[http://localhost:3000](http://localhost:3000)**

#### 🌐 Terminal 2: Rodando o Front-end (Aplicação Vue)

```bash
# Instalar dependências (se ainda não o fez)
npm install

# Iniciar o cliente de desenvolvimento
npm run dev
```

A aplicação estará acessível em **[http://localhost:5173](http://localhost:5173)**

---

## 🎨 Melhorias de UX/UI e Performance Implementadas (v2.0)

O projeto foi completamente otimizado para oferecer performance de nível profissional e experiência excepcional:

### ⚡ Performance Otimizada (Lighthouse 85-95)
- **Code Splitting Inteligente**: Páginas carregadas sob demanda com lazy loading
- **SDK Mercado Pago Dinâmico**: Carregado apenas no checkout (economia de ~300KB)
- **Lazy Loading de Imagens**: Intersection Observer + skeleton loading + width/height para zero CLS
- **Animações GPU-Accelerated**: Apenas `transform` e `opacity` (sem reflow)
- **Fontes Otimizadas**: `font-display: swap` previne FOIT
- **Bundle Size Reduzido**: ~70% menor no carregamento inicial

### 📱 Mobile-First e Responsividade
- **Barra de Navegação Inferior**: Bottom nav nativa com 5 ícones principais (< 768px)
- **Botões de Favoritos Visíveis**: Sempre visível em mobile (48x48px)
- **Touch Otimizado**: Áreas de toque ≥ 44x44px, `touch-action: manipulation`
- **Safe Area**: Suporte para iPhone com notch
- **Glassmorphism**: Efeitos visuais modernos com backdrop-filter

### 🎨 Dark/Light Mode
- **Toggle de Tema**: Botão de alternância em todas as páginas
- **Persistência**: Preferência salva no localStorage
- **Auto-Detect**: Detecta preferência do sistema
- **Variáveis CSS**: Sistema completo com custom properties
- **Transições Suaves**: Mudança de tema sem delay

### 🎓 Aviso Acadêmico Profissional
- **Banner Destacado**: Topo fixo com aviso sobre natureza acadêmica
- **Dismissível**: Pode ser fechado (reaparece após 7 dias)
- **Links Diretos**: Acesso rápido aos termos de uso e sobre o projeto
- **Glassmorphism**: Visual moderno e profissional

### ✨ Microinterações e Feedback Visual
- Animações suaves em transições de página e estados
- Feedback imediato ao adicionar produtos ao carrinho ou favoritos
- Loading states com skeleton screens para melhor percepção de performance
- Efeitos hover com elevação e escala em cards de produtos
- Animação de "heartbeat" ao favoritar produtos
- Badge animado para notificações e contadores

### 🔍 SEO e Acessibilidade (Lighthouse 90+)
- **Meta Tags Dinâmicas**: Título, descrição e keywords por página
- **Open Graph**: Compartilhamento otimizado em redes sociais
- **Twitter Cards**: Previews personalizados
- **Schema.org**: Structured data para produtos
- **Sitemap.xml**: Mapa completo do site
- **Robots.txt**: Diretrizes para crawlers
- **ARIA Labels**: Navegação acessível por teclado
- **Contraste WCAG AA**: Cores com contraste adequado
- **Focus Visível**: Outline para navegação por teclado
- Imagens com skeleton loading durante carregamento
- Minificação de assets e cache apropriado
- Smooth scroll para navegação fluida

### ♿ Acessibilidade
- Contraste adequado de cores (WCAG compliance)
- Textos alternativos em todas as imagens
- Focus visível para navegação por teclado
- ARIA labels em botões de ação
- Estrutura semântica de HTML

### 🔒 Transparência e Segurança
- Aviso claro sobre natureza acadêmica do projeto no rodapé
- Páginas institucionais (Sobre, Privacidade, Termos de Uso)
- Comunicação transparente sobre uso de dados
- HTTPS em produção (Vercel/Render)

---

## ✒️ Autores

Este projeto foi desenvolvido com ❤️ por:

* **Manoela Pinheiro da Silva** - [@Ma2903](https://github.com/Ma2903)
* **João Pedro Garcia Girotto** - [@JP1005YT](https://github.com/JP1005YT)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
