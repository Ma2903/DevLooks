<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
          <i class="fas fa-shield-alt text-3xl text-white"></i>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Política de Privacidade</h1>
        <p class="text-gray-400">Última atualização: 17 de novembro de 2025</p>
      </div>

      <!-- Aviso Importante -->
      <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-blue-400 text-xl mt-1"></i>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">Projeto Acadêmico</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
              Esta política de privacidade refere-se a um <strong>projeto acadêmico</strong>. 
              Os dados coletados são utilizados exclusivamente para fins de demonstração e aprendizado. 
              Não comercializamos, vendemos ou compartilhamos informações pessoais com terceiros.
            </p>
          </div>
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="space-y-8">
        <!-- Seção 1 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-database"></i>
            1. Dados Coletados
          </h2>
          <p class="text-gray-300 mb-4">Coletamos as seguintes informações quando você utiliza o DevLooks:</p>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-3">
              <i class="fas fa-check text-emerald-400 mt-1"></i>
              <div>
                <strong>Dados de Cadastro:</strong> Nome, e-mail e senha (criptografada)
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check text-emerald-400 mt-1"></i>
              <div>
                <strong>Dados de Endereço:</strong> CEP, rua, número, cidade, estado (para cálculo de frete)
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check text-emerald-400 mt-1"></i>
              <div>
                <strong>Histórico de Navegação:</strong> Produtos visualizados, favoritos, carrinho
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check text-emerald-400 mt-1"></i>
              <div>
                <strong>Avaliações de Produtos:</strong> Comentários e avaliações que você publica
              </div>
            </li>
          </ul>
        </section>

        <!-- Seção 2 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-lock"></i>
            2. Como Protegemos Seus Dados
          </h2>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-3">
              <i class="fas fa-shield-alt text-green-400 mt-1"></i>
              <div>
                <strong>Criptografia de Senhas:</strong> Utilizamos bcrypt para hash seguro de senhas
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-shield-alt text-green-400 mt-1"></i>
              <div>
                <strong>HTTPS:</strong> Todo tráfego é criptografado via SSL/TLS
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-shield-alt text-green-400 mt-1"></i>
              <div>
                <strong>JWT (JSON Web Tokens):</strong> Autenticação segura sem armazenar senhas em cookies
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-shield-alt text-green-400 mt-1"></i>
              <div>
                <strong>Banco de Dados Protegido:</strong> MongoDB Atlas com autenticação e backup automático
              </div>
            </li>
          </ul>
        </section>

        <!-- Seção 3 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-share-alt"></i>
            3. Compartilhamento de Dados
          </h2>
          <p class="text-gray-300 mb-4">Seus dados podem ser compartilhados apenas com:</p>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-3">
              <i class="fas fa-credit-card text-blue-400 mt-1"></i>
              <div>
                <strong>Mercado Pago:</strong> Para processar pagamentos (nome, e-mail, dados de endereço)
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-robot text-purple-400 mt-1"></i>
              <div>
                <strong>Google Gemini AI:</strong> Para análise de sentimentos em avaliações (apenas texto dos comentários, sem dados pessoais)
              </div>
            </li>
          </ul>
          <div class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p class="text-yellow-300 text-sm">
              <strong>Importante:</strong> NÃO vendemos, alugamos ou compartilhamos seus dados com empresas de marketing ou publicidade.
            </p>
          </div>
        </section>

        <!-- Seção 4 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-cookie-bite"></i>
            4. Cookies e Armazenamento Local
          </h2>
          <p class="text-gray-300 mb-4">Utilizamos as seguintes tecnologias de armazenamento:</p>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-3">
              <i class="fas fa-key text-yellow-400 mt-1"></i>
              <div>
                <strong>LocalStorage:</strong> Armazena token de autenticação (JWT) e preferências do usuário
              </div>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-shopping-cart text-orange-400 mt-1"></i>
              <div>
                <strong>Carrinho e Favoritos:</strong> Salvos localmente para melhor experiência
              </div>
            </li>
          </ul>
          <p class="text-gray-400 text-sm mt-4">
            Você pode limpar esses dados a qualquer momento através das configurações do seu navegador.
          </p>
        </section>

        <!-- Seção 5 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-user-check"></i>
            5. Seus Direitos
          </h2>
          <p class="text-gray-300 mb-4">Você tem direito a:</p>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start gap-3">
              <i class="fas fa-eye text-blue-400 mt-1"></i>
              <span><strong>Acessar</strong> seus dados pessoais armazenados</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-edit text-yellow-400 mt-1"></i>
              <span><strong>Corrigir</strong> informações incorretas em seu perfil</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-trash text-red-400 mt-1"></i>
              <span><strong>Excluir</strong> sua conta e todos os dados associados</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-ban text-gray-400 mt-1"></i>
              <span><strong>Revogar</strong> consentimentos dados anteriormente</span>
            </li>
          </ul>
          <p class="text-gray-400 text-sm mt-4">
            Para exercer esses direitos, acesse seu perfil ou entre em contato conosco.
          </p>
        </section>

        <!-- Seção 6 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-clock"></i>
            6. Retenção de Dados
          </h2>
          <p class="text-gray-300">
            Mantemos seus dados apenas enquanto você tiver uma conta ativa no DevLooks. 
            Após exclusão da conta, seus dados são removidos permanentemente em até 30 dias, 
            exceto quando exigido por lei (como histórico de transações financeiras).
          </p>
        </section>

        <!-- Seção 7 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-bell"></i>
            7. Alterações nesta Política
          </h2>
          <p class="text-gray-300">
            Podemos atualizar esta política periodicamente. Quando isso acontecer, 
            notificaremos você por e-mail ou através de um aviso no site. 
            A data da última atualização estará sempre visível no topo desta página.
          </p>
        </section>

        <!-- Seção 8 -->
        <section class="bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i class="fas fa-envelope"></i>
            8. Contato
          </h2>
          <p class="text-gray-300 mb-4">
            Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos seus dados, entre em contato:
          </p>
          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-300">
              <i class="fas fa-envelope text-emerald-400 mr-2"></i>
              <strong>E-mail:</strong> devlooks.suporte@gmail.com
            </p>
          </div>
        </section>
      </div>

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
