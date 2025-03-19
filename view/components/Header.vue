<script>
import { ref, computed } from 'vue'

export default {
    setup(props, { emit }) {
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

        const navigate = (page) => {
            emit('navigate', page)
        }

        return {
            count,
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
            toggleTheme,
            navigate
        }
    },
    name: 'Header'
}
</script>

<template>
    <header class="bg-gray-800 text-white p-4 md:p-6 shadow-lg">
        <div class="container mx-auto flex flex-wrap justify-between items-center">
            <!-- Logo -->
            <div class="text-2xl md:text-3xl font-bold text-purple-400 flex items-center space-x-2">
                <img src="../assets/logo_teste.jpg" alt="Logo da Loja de Avatares" class="w-16 h-16 md:w-24 md:h-24 rounded-full animate-spin-slow">
                <span class="title-highlight">Loja de Avatares </span>
            </div>
            <!-- Navegação -->
            <nav :class="{'hidden': !menuOpen, 'block': menuOpen}" class="w-full md:w-auto md:flex md:items-center md:space-x-6 text-lg md:text-xl mt-4 md:mt-0">
                <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                    <li><router-link to="/Home" @click.native="navigate('home')" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-home"></i><span>Home</span></router-link></li>
                    <li><router-link to="/create-avatar" @click.native="navigate('create-avatar')" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-user-plus"></i><span>Criar Avatar</span></router-link></li>
                    <li><router-link to="/Home" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-info-circle"></i><span>Sobre</span></router-link></li>
                    <li><router-link to="/Home" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-cogs"></i><span>Funcionalidades</span></router-link></li>
                    <li><router-link to="/Home" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-box-open"></i><span>Produtos</span></router-link></li>
                    <li><router-link to="/profile" class="hover:text-purple-500 flex items-center space-x-1"><i class="fas fa-user"></i><span>Perfil</span></router-link></li>
                </ul>
            </nav>
            <!-- Menu Toggle Button -->
            <button @click="toggleMenu" class="md:hidden text-2xl">
                <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
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
    background: linear-gradient(45deg, #9B4DFF, #D8B4FE);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(155, 77, 255, 0.7), 0 0 20px rgba(155, 77, 255, 0.5);
    font-family: 'Fira Code', monospace; /* Fonte monoespaçada */
    letter-spacing: 2px; /* Espaçamento entre letras */
    animation: glow 1.5s infinite alternate;
}

.title-highlight .text-4xl {
    font-size: 4rem; /* Tamanho maior para a palavra "Avatares" */
    background: linear-gradient(45deg, #D8B4FE, #9B4DFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6), 0 0 10px rgba(216, 180, 254, 0.7), 0 0 20px rgba(216, 180, 254, 0.5);
    animation: glow 1.5s infinite alternate;
}

@keyframes glow {
    from {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(155, 77, 255, 0.7), 0 0 20px rgba(155, 77, 255, 0.5);
    }
    to {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(155, 77, 255, 1), 0 0 30px rgba(155, 77, 255, 0.7);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>