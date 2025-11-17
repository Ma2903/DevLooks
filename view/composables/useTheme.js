// 🎨 Sistema de Tema Dark/Light Mode
import { ref } from 'vue';

// Estado global compartilhado entre todas as instâncias
const currentTheme = ref(null);
const THEME_KEY = 'devlooks-theme';
let isInitialized = false;

export function useTheme() {
  
  // Inicializa o tema do localStorage ou usa o padrão
  const initTheme = () => {
    // Só inicializa uma vez
    if (isInitialized && currentTheme.value !== null) {
      console.log('🎨 Tema já inicializado:', currentTheme.value);
      return;
    }
    
    const savedTheme = localStorage.getItem(THEME_KEY);
    let theme;
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      theme = savedTheme;
    } else {
      // Detecta preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    currentTheme.value = theme;
    applyTheme(theme);
    isInitialized = true;
  };

  // Aplica o tema ao documento
  const applyTheme = (theme) => {
    console.log('🎨 Aplicando tema:', theme);
    
    // Atributo data-theme para variáveis CSS
    document.documentElement.setAttribute('data-theme', theme);
    
    // Tailwind dark mode requer a classe 'dark' no elemento HTML
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Aplica classes no body também para transição suave
    document.body.classList.remove('bg-gray-900', 'text-white', 'bg-white', 'text-gray-900');
    if (theme === 'dark') {
      document.body.classList.add('bg-gray-900', 'text-white');
    } else {
      document.body.classList.add('bg-white', 'text-gray-900');
    }
    
    localStorage.setItem(THEME_KEY, theme);
    console.log('✅ Tema aplicado! Classes no HTML:', document.documentElement.classList.toString());
  };

  // Alterna entre dark e light
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark';
    console.log('🔄 Alternando tema de', currentTheme.value, 'para', newTheme);
    currentTheme.value = newTheme;
    applyTheme(newTheme);
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
        const newTheme = e.matches ? 'dark' : 'light';
        currentTheme.value = newTheme;
        applyTheme(newTheme);
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
