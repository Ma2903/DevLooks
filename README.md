# 🛍️ DevLooks E-commerce

![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square&logo=node.js)
![Git](https://img.shields.io/badge/Git-Repo-blue?style=flat-square&logo=git)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square&logo=mongodb)
![Build](https://img.shields.io/badge/Build-Passing-success?style=flat-square&logo=githubactions)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square&logo=open-source-initiative)

---

**DevLooks** é uma plataforma de e-commerce full-stack, desenvolvida do zero e voltada para o público de tecnologia.  
O projeto permite que programadores expressem seu estilo através da compra de produtos como camisetas, skins e itens de setup, além de contar com um sistema exclusivo para criação de avatares personalizados.

A aplicação foi construída com foco em uma experiência de usuário moderna e uma arquitetura robusta, separando claramente as responsabilidades entre front-end e back-end.

---

## ✨ Funcionalidades Principais

O projeto conta com um sistema completo, incluindo funcionalidades para clientes e para administração.

### 👥 Para Clientes
- **Autenticação de Usuários:** Sistema completo de cadastro e login com tokens JWT.  
- **Catálogo de Produtos:** Navegação por produtos com filtros por categoria e busca por nome/descrição.  
- **Carrinho de Compras:** Adição, remoção e atualização de quantidade de itens.  
- **Criação de Avatares:** Ferramenta para personalizar e salvar avatares únicos.  
- **Sistema de Cupons:** Aplicação de cupons de desconto (valor fixo ou porcentagem).  
- **Checkout Completo:** Processo de finalização de compra com cálculo de frete e integração de pagamento via **MercadoPago**.  
- **Histórico de Pedidos:** Área para o usuário visualizar suas compras anteriores.  

### 🛠️ Painel de Administração
- **Gerenciamento de Produtos (CRUD):** Adicionar, visualizar, editar e remover produtos.  
- **Gerenciamento de Usuários:** Visualização e alteração de permissões de usuários.  
- **Gerenciamento de Pedidos:** Acompanhamento e atualização do status dos pedidos.  
- **Gerenciamento de Cupons:** Criação e administração de cupons de desconto.  

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com uma arquitetura moderna, utilizando as seguintes tecnologias:

### **Front-End**
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### **Back-End**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### **Ferramentas e Outros**
- **Autenticação:** JWT (JSON Web Tokens)

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

# CEP de origem para cálculo de frete
CORREIOS_CEP_ORIGEM=SEU_CEP_DE_ORIGEM
```

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

## ✒️ Autores

Este projeto foi desenvolvido com ❤️ por:

* **Manoela Pinheiro da Silva** - [@Ma2903](https://github.com/Ma2903)
* **João Pedro Garcia Girotto** - [@JP1005YT](https://github.com/JP1005YT)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
