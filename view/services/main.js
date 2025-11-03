// view/services/main.js

import axios from 'axios';

// Cria uma instância do axios que usaremos em todo o app
const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

// Interceptor de REQUISIÇÃO - Adiciona o token antes de enviar
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPOSTA - Trata erros de autenticação (token expirado)
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, apenas retorna
    return response;
  },
  (error) => {
    // Se o erro for 401 (não autorizado) e o token expirou
    if (error.response?.status === 401) {
      const isTokenExpired = error.response?.data?.expired;
      
      // Limpa o localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      
      // Dispara evento para atualizar o estado da aplicação
      window.dispatchEvent(new Event('auth-change'));
      
      // Se estiver em uma página que requer autenticação, redireciona para login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
      
      // Mostra mensagem amigável
      if (isTokenExpired) {
        console.warn('⚠️  Sessão expirada. Redirecionando para login...');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;