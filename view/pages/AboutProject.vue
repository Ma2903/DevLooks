<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full mb-6">
          <i class="fas fa-graduation-cap text-3xl text-white"></i>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Sobre o Projeto DevLooks</h1>
        <p class="text-xl text-gray-400">Um E-commerce Acadêmico Full-Stack</p>
      </div>

      <!-- Objetivo -->
      <section class="bg-gray-800 rounded-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <i class="fas fa-bullseye"></i>
          Objetivo do Projeto
        </h2>
        <p class="text-gray-300 leading-relaxed">
          O <strong>DevLooks</strong> é um projeto acadêmico desenvolvido para demonstrar conhecimentos práticos em desenvolvimento web full-stack. 
          Este e-commerce simula uma loja online real voltada para desenvolvedores, com funcionalidades completas de catálogo, carrinho, 
          pagamento integrado e gerenciamento de pedidos.
        </p>
        <div class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p class="text-yellow-300 text-sm flex items-start gap-2">
            <i class="fas fa-exclamation-triangle mt-1"></i>
            <span><strong>Importante:</strong> Este não é um e-commerce real com estoque físico. Embora utilize APIs reais (como Mercado Pago), 
            o projeto foi criado exclusivamente para fins educacionais e de aprendizado.</span>
          </p>
        </div>
      </section>

      <!-- Tecnologias -->
      <section class="bg-gray-800 rounded-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
          <i class="fas fa-code"></i>
          Tecnologias Utilizadas
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Frontend -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <i class="fas fa-paint-brush text-purple-400"></i>
              Frontend
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-center gap-2">
                <i class="fab fa-vuejs text-emerald-400"></i>
                <strong>Vue.js 3</strong> - Framework JavaScript reativo
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-route text-blue-400"></i>
                <strong>Vue Router</strong> - Roteamento SPA
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-palette text-cyan-400"></i>
                <strong>Tailwind CSS</strong> - Framework CSS utilitário
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-fire text-orange-400"></i>
                <strong>SweetAlert2</strong> - Modais e alertas elegantes
              </li>
            </ul>
          </div>

          <!-- Backend -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <i class="fas fa-server text-green-400"></i>
              Backend
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-center gap-2">
                <i class="fab fa-node-js text-green-500"></i>
                <strong>Node.js + Express</strong> - Servidor web
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-file-code text-blue-500"></i>
                <strong>TypeScript</strong> - Tipagem estática
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-database text-green-600"></i>
                <strong>MongoDB</strong> - Banco de dados NoSQL
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-shield-alt text-yellow-500"></i>
                <strong>JWT + bcrypt</strong> - Autenticação segura
              </li>
            </ul>
          </div>

          <!-- Integrações -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <i class="fas fa-plug text-yellow-400"></i>
              Integrações e APIs
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-center gap-2">
                <i class="fas fa-credit-card text-blue-400"></i>
                <strong>Mercado Pago SDK</strong> - Gateway de pagamento
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-robot text-purple-500"></i>
                <strong>Google Gemini AI</strong> - Análise de sentimentos
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-truck text-orange-400"></i>
                <strong>Sistema de Frete</strong> - Cálculo por CEP
              </li>
            </ul>
          </div>

          <!-- Deploy -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <i class="fas fa-cloud text-cyan-400"></i>
              Deploy e Hospedagem
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-center gap-2">
                <i class="fas fa-globe text-purple-400"></i>
                <strong>Vercel</strong> - Frontend
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-server text-green-400"></i>
                <strong>Render</strong> - Backend API
              </li>
              <li class="flex items-center gap-2">
                <i class="fas fa-database text-green-600"></i>
                <strong>MongoDB Atlas</strong> - Database cloud
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Funcionalidades -->
      <section class="bg-gray-800 rounded-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
          <i class="fas fa-list-check"></i>
          Principais Funcionalidades
        </h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-shopping-cart text-emerald-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Carrinho de Compras</h4>
              <p class="text-sm text-gray-400">Adicionar, remover e gerenciar produtos</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-heart text-red-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Lista de Favoritos</h4>
              <p class="text-sm text-gray-400">Salvar produtos para comprar depois</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-credit-card text-blue-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Pagamento Real</h4>
              <p class="text-sm text-gray-400">Integração com Mercado Pago (sandbox)</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-user-shield text-purple-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Autenticação JWT</h4>
              <p class="text-sm text-gray-400">Login seguro com criptografia</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-robot text-cyan-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">IA - Análise de Reviews</h4>
              <p class="text-sm text-gray-400">Sentimento e resumo automático com Gemini</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-user-tie text-yellow-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Painel Admin</h4>
              <p class="text-sm text-gray-400">Gerenciar produtos, cupons e pedidos</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-truck text-orange-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Cálculo de Frete</h4>
              <p class="text-sm text-gray-400">Simulação por CEP e região</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <i class="fas fa-ticket-alt text-pink-400 mt-1"></i>
            <div>
              <h4 class="font-semibold text-white">Sistema de Cupons</h4>
              <p class="text-sm text-gray-400">Descontos percentuais e fixos</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Aprendizados -->
      <section class="bg-gray-800 rounded-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <i class="fas fa-lightbulb"></i>
          Aprendizados e Objetivos Alcançados
        </h2>
        <ul class="space-y-3 text-gray-300">
          <li class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-400 mt-1"></i>
            <span>Desenvolvimento full-stack completo (frontend + backend + banco de dados)</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-400 mt-1"></i>
            <span>Integração com APIs externas (Mercado Pago, Google Gemini AI)</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-400 mt-1"></i>
            <span>Implementação de autenticação e autorização (JWT, bcrypt)</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-400 mt-1"></i>
            <span>Arquitetura MVC e padrões de design (Factory, Observer)</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-400 mt-1"></i>
            <span>Deploy profissional em plataformas cloud (Vercel, Render)</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-400 mt-1"></i>
            <span>Uso de TypeScript para código mais robusto e seguro</span>
          </li>
        </ul>
      </section>

      <!-- Contato/Repositório -->
      <section class="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-lg p-8">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <i class="fas fa-code-branch"></i>
          Código Fonte
        </h2>
        <p class="text-gray-300 mb-4">
          Este projeto é de código aberto e está disponível no GitHub para consulta e aprendizado.
        </p>
        <a href="https://github.com/Ma2903/DevLooks" target="_blank" 
           class="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition">
          <i class="fab fa-github"></i>
          Ver no GitHub
        </a>
      </section>

      <!-- Botão Voltar -->
      <div class="text-center mt-12">
        <router-link to="/" 
                     class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg transition">
          <i class="fas fa-arrow-left"></i>
          Voltar para a Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>
