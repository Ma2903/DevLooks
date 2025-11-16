// view/services/config.js

// URL base da API - usa variável de ambiente ou localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para gerar URLs de imagens
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Primeiro normaliza as barras invertidas para barras normais
  let cleanPath = imagePath.replace(/\\/g, '/');
  
  // Remove 'public/' do início se existir
  cleanPath = cleanPath.replace(/^public\//, '');
  
  // Remove barras duplicadas no início
  cleanPath = cleanPath.replace(/^\/+/, '');
  
  return `${API_BASE_URL}/${cleanPath}`;
};

export default {
  API_BASE_URL,
  getImageUrl
};
