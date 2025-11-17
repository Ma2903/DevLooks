import './assets/main.css'

import { createApp } from 'vue'
import router from './router'; // Importando o arquivo de rotas
import App from './App.vue'

// 🎨 Inicializa o tema antes de montar a aplicação
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('devlooks-theme');
  let theme = 'dark'; // padrão
  
  if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
    theme = savedTheme;
  } else {
    // Detecta preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  // Aplica o tema no HTML (importante para Tailwind dark mode)
  document.documentElement.setAttribute('data-theme', theme);
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900', 'text-white');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.add('bg-white', 'text-gray-900');
  }
  
  console.log('🎨 Tema inicial:', theme, '| Classes HTML:', document.documentElement.className);
};

initializeTheme();

const app = createApp(App);
app.use(router); // Adiciona o Vue Router à instância do aplicativo
app.mount('#app');
