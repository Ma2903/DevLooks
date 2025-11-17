// 🎨 Sistema de Tema Dark/Light Mode
import { ref, watch, onMounted } from 'vue';

const currentTheme = ref('dark'); // Padrão: dark mode
const THEME_KEY = 'devlooks-theme';

export function useTheme() {
  
  // Inicializa o tema do localStorage ou usa o padrão
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      currentTheme.value = savedTheme;
    } else {
      // Detecta preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme.value = prefersDark ? 'dark' : 'light';
    }
    applyTheme(currentTheme.value);
  };

  // Aplica o tema ao documento
  const applyTheme = (theme) => {
    // Atributo data-theme para variáveis CSS
    document.documentElement.setAttribute('data-theme', theme);
    
    // Classe para Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-white', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900', 'text-white');
      document.body.classList.add('bg-white', 'text-gray-900');
    }
    
    localStorage.setItem(THEME_KEY, theme);
    console.log('🎨 Tema aplicado:', theme);
  };

  // Alterna entre dark e light
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme.value);
  };

  // Define um tema específico
  const setTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      currentTheme.value = theme;
      applyTheme(theme);
    }
  };

  // Observa mudanças de tema do sistema
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Só muda automaticamente se usuário não tiver preferência salva
      if (!localStorage.getItem(THEME_KEY)) {
        currentTheme.value = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme.value);
      }
    });
  };

  return {
    currentTheme,
    initTheme,
    toggleTheme,
    setTheme,
    watchSystemTheme,
    isDark: () => currentTheme.value === 'dark'
  };
}
