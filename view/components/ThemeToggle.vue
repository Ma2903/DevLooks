<template>
  <button
    @click="toggleTheme"
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    class="theme-toggle-btn p-2 rounded-lg transition-all duration-300 hover:bg-gray-700 dark:hover:bg-gray-600"
  >
    <!-- Ícone de Sol (Light Mode) -->
    <svg
      v-if="!isDark"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-yellow-500 transition-transform duration-300 hover:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Ícone de Lua (Dark Mode) -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-blue-400 transition-transform duration-300 hover:rotate-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { currentTheme, toggleTheme } = useTheme();

const isDark = computed(() => currentTheme.value === 'dark');
</script>

<style scoped>
.theme-toggle-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.theme-toggle-btn:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
</style>
