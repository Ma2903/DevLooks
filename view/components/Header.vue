<script>
import { ref, computed } from 'vue'

export default {
    setup() {
        const count = ref(0)
        const menuOpen = ref(false)
        const dropdownOpen = ref(false)
        const isAuthenticated = ref(false)
        const username = ref('Usuário')
        const userAvatar = ref('https://via.placeholder.com/50')
        const theme = ref('light')

        const themeText = computed(() => (theme.value === 'light' ? 'Dark Mode' : 'Light Mode'))

        const toggleMenu = () => {
            menuOpen.value = !menuOpen.value
        }

        const toggleDropdown = () => {
            dropdownOpen.value = !dropdownOpen.value
        }

        const logout = () => {
            isAuthenticated.value = false
            dropdownOpen.value = false
        }

        const toggleTheme = () => {
            theme.value = theme.value === 'light' ? 'dark' : 'light'
            document.documentElement.classList.toggle('dark')
        }

        function countAdd() {
            count.value++
        }

        return {
            count,
            countAdd,
            menuOpen,
            dropdownOpen,
            isAuthenticated,
            username,
            userAvatar,
            theme,
            themeText,
            toggleMenu,
            toggleDropdown,
            logout,
            toggleTheme
        }
    },
}
</script>

<template>
    <header
    class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-md"
  >
    <div class="flex items-center gap-2">
      <img src="" alt="Logo" class="w-10 h-10" />
      <h1 class="text-2xl font-bold">Loja de Avatares</h1>
    </div>
    <nav class="hidden md:flex gap-4">
      <a href="#" class="hover:underline" key="home">Home</a>
      <a href="#" class="hover:underline" key="avatares">Avatares</a>
      <a href="#" class="hover:underline" key="sobre">Sobre</a>
    </nav>
    <div class="flex items-center gap-4">
      <button
        @click="toggleTheme"
        class="text-white bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700"
      >
        {{ themeText }}
      </button>
      <button
        v-if="!isAuthenticated"
        class="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
      >
        Login
      </button>
      <div v-else class="relative group">
        <img
          :src="userAvatar"
          alt="Avatar"
          class="w-10 h-10 rounded-full cursor-pointer"
          @click="toggleDropdown"
        />
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md p-2"
        >
          <p class="px-4 py-2">Olá, {{ username }}</p>
          <a href="#" class="block px-4 py-2 hover:bg-gray-200">Perfil</a>
          <a href="#" class="block px-4 py-2 hover:bg-gray-200">Meus Avatares</a>
          <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-200">Sair</button>
        </div>
      </div>
      <button class="md:hidden text-white text-2xl" @click="toggleMenu">☰</button>
    </div>
  </header>
</template>
