import { ref } from 'vue';

// 'ref' cria uma variável reativa. Qualquer componente que usar 'user'
// será atualizado automaticamente quando seu valor mudar.
export const user = ref(null);
export const isAdmin = ref(false);

// Função para atualizar o estado do usuário a partir do localStorage
export function updateUserState() {
  const storedUser = localStorage.getItem('userData');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    user.value = userData;
    isAdmin.value = userData.role === 'admin' || userData.role === 'owner';
  } else {
    user.value = null;
    isAdmin.value = false;
  }
}