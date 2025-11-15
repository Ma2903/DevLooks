// view/services/config.js

// URL base da API - usa variável de ambiente ou localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para gerar URLs de imagens
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Remove barras duplicadas e normaliza o caminho
  const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  return `${API_BASE_URL}/${cleanPath}`;
};

export default {
  API_BASE_URL,
  getImageUrl
};
