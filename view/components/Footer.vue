<template>
  <!-- Rodapé -->
  <footer class="bg-gray-900 py-8 text-gray-300">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Sobre Nós -->
      <div>
        <h3 class="text-lg font-bold text-purple-400 mb-4">Sobre Nós</h3>
        <p>
          Somos apaixonados por tecnologia e cultura geek. Oferecemos produtos exclusivos para personalizar seu estilo.
        </p>
      </div>

      <!-- Contato e Redes Sociais -->
      <div>
        <h3 class="text-lg font-bold text-purple-400 mb-4">Contato</h3>
        <p>Entre em contato conosco:</p>
        <ul class="mt-4">
          <li class="flex items-center space-x-2">
            <i class="fas fa-envelope text-purple-400"></i>
            <span>contato@lojageek.com</span>
          </li>
          <li class="flex items-center space-x-2 mt-2">
            <i class="fas fa-phone text-purple-400"></i>
            <span>(11) 99999-9999</span>
          </li>
          <li class="flex items-center space-x-2 mt-2">
            <i class="fas fa-map-marker-alt text-purple-400"></i>
            <span>Rua Geek, 123 - São Paulo, SP</span>
          </li>
        </ul>
      </div>

      <!-- Redes Sociais -->
      <div>
        <h3 class="text-lg font-bold text-purple-400 mb-4">Siga-nos</h3>
        <div class="flex space-x-4">
          <a href="#" class="hover:text-purple-500"><i class="fab fa-facebook text-2xl"></i></a>
          <a href="#" class="hover:text-purple-500"><i class="fab fa-instagram text-2xl"></i></a>
          <a href="#" class="hover:text-purple-500"><i class="fab fa-twitter text-2xl"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  methods: {
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
footer {
  border-top: 2px solid #444444;
}

footer a:hover {
  color: #9b4dff;
}
</style>