<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 py-20 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-12 animate-fade-in-down">
        <i class="fas fa-rocket text-6xl text-emerald-400"></i>
        <h1 class="text-5xl font-extrabold text-white mt-4">Nossa Missão</h1>
        <p class="text-xl text-gray-400 mt-2">Equipando os devs do futuro, um look de cada vez.</p>
      </div>

      <div class="bg-gray-800 p-8 rounded-lg shadow-lg text-lg leading-relaxed space-y-6 border-t-4 border-emerald-400 animate-fade-in-up">
        <p>
          Bem-vindo à <span class="font-bold text-emerald-400">DevLooks</span>, o e-commerce criado de devs para devs. Nascemos da ideia de que programadores, designers e todos os apaixonados por tecnologia merecem produtos que reflitam seu estilo de vida, suas paixões e seu senso de humor único.
        </p>
        <p>
          Mais do que uma loja, somos uma comunidade. Cada produto, desde a criação de avatares até nossas camisetas com piadas de código, é pensado para celebrar a cultura tech. Nossa missão é oferecer itens exclusivos e de alta qualidade que você terá orgulho de usar e exibir.
        </p>
        <p class="border-t border-gray-700 pt-6 mt-6 font-semibold">
          Na <span class="font-bold text-emerald-400">DevLooks</span>, valorizamos a experiência do cliente, a criatividade e, claro, um código bem limpo. Junte-se a nós e mostre ao mundo o seu look de dev!
        </p>
      </div>

      <div class="mt-20 text-center animate-fade-in-up" style="animation-delay: 0.4s;">
        <h2 class="text-4xl font-extrabold text-white mb-10">Nossos Desenvolvedores</h2>
        <div class="flex flex-col md:flex-row justify-center items-center gap-10">
          
          <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center border-b-4 border-emerald-400">
            <img src="/images/manoela.jpeg" alt="Foto da Manoela" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 object-cover">
            <h3 class="text-2xl font-bold text-white">Manoela Pinheiro da Silva</h3>
            <p class="text-emerald-400 font-semibold mb-3">Desenvolvedora Full-Stack</p>
            <p class="text-gray-400 mb-4">
              Apaixonada por criar soluções inovadoras e interfaces intuitivas que resolvem problemas reais.
            </p>
            <div class="flex justify-center gap-4 text-2xl">
              <a href="https://github.com/Ma2903" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors"><i class="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/manoelaps" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center border-b-4 border-emerald-400">
            <img src="/images/joao-girotto.jpeg" alt="Foto do João Pedro" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 object-cover">
            <h3 class="text-2xl font-bold text-white"> João Pedro Garcia Girotto</h3>
            <p class="text-emerald-400 font-semibold mb-3">Desenvolvedor Full-Stack</p>
            <p class="text-gray-400 mb-4">
              Especialista em arquiteturas robustas de backend e em garantir a performance e escalabilidade do sistema.
            </p>
            <div class="flex justify-center gap-4 text-2xl">
              <a href="https://github.com/JP1005YT" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors"><i class="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/joaogirotto0/" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
</style>