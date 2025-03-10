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
    <header class="bg-gray-800 text-white p-6 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
            <!-- Logo -->
            <div class="text-3xl font-bold text-purple-400 flex items-center space-x-2">
                <img src="../assets/logo_teste.jpg" alt="Logo" class="w-24 h-24 rounded-full animate-spin-slow">
                <span class="title-highlight">Loja de Avatares</span>
            </div>
            <!-- Navegação -->
            <nav>
                <ul class="flex space-x-6 text-xl">
                    <li><a href="#" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-home"></i><span>Home</span></a></li>
                    <li><a href="#create-avatar" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-user-plus"></i><span>Criar Avatar</span></a></li>
                    <li><a href="#about" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-info-circle"></i><span>Sobre</span></a></li>
                </ul>
            </nav>
            <!-- Tema -->
            <button @click="toggleTheme" class="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 border-2 border-purple-600 hover:from-purple-600 hover:to-purple-800 transition duration-300">
                <i :class="theme.value === 'light' ? 'fas fa-moon' : 'fas fa-sun'"></i>
            </button>
        </div>
    </header>
</template>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

header {
    background-color: #232323;
}

a:hover {
    color: #9B4DFF; /* Roxo vibrante nos links quando passa o mouse */
}

button:hover {
    transform: scale(1.05);
}

.animate-spin-slow {
    animation: spin 10s linear infinite;
}

.title-highlight {
    font-size: 3.5rem; /* Aumenta o tamanho da fonte */
    color: #9B4DFF; /* Cor roxa vibrante */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Adiciona sombra ao texto */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>