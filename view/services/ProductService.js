import api from "./main.js";

// ProductService agora usa a instância configurada do axios (api)
// que automaticamente usa a URL correta baseada em VITE_API_URL

export default {
  // Buscar todos os produtos
  async getAllProducts() {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error; // Propaga o erro para o componente tratar
    }
  },

  // Buscar um produto pelo ID
  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o produto ${id}:`, error);
      throw error;
    }
  },

  // Criar um novo produto
  // (Este método recebe um FormData por causa do upload de imagem)
  async createProduct(productData) {
    try {
      const response = await api.post('/api/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar um produto existente
  // (Também pode receber FormData se a imagem for atualizada)
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar o produto ${id}:`, error);
      throw error;
    }
  },

  // Deletar um produto
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data; // Retorna a mensagem de sucesso do backend
    } catch (error) {
      console.error(`Erro ao deletar o produto ${id}:`, error);
      throw error;
    }
  },

  // Buscar os produtos mais vendidos
  async getBestSellingProducts() {
    try {
      const response = await api.get('/api/products/best-selling');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
      throw error;
    }
  },

  // Buscar os produtos mais recentes
  async getLatestProducts() {
    try {
      const response = await api.get('/api/products/latest');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos recentes:', error);
      throw error;
    }
  },
};