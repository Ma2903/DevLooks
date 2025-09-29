// view/services/main.js

import axios from 'axios';

// Cria uma instância do axios que usaremos em todo o app
const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

// Isso é um "interceptor". Ele age como um porteiro para todas as requisições.
// Antes de qualquer requisição sair do seu app, ele vai pegar o token e anexá-lo.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Adiciona o cabeçalho de autorização em todas as chamadas da API
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;