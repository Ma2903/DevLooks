import axios from "axios";

// Define a URL base completa para a API de produtos.
// Isso torna o código mais claro e fácil de manter.
const API_URL = 'http://localhost:3000/api/products';

export default {
  // Buscar todos os produtos
  async getAllProducts() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error; // Propaga o erro para o componente tratar
    }
  },

  // Buscar um produto pelo ID
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
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
      const response = await axios.post(API_URL, productData, {
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
      const response = await axios.put(`${API_URL}/${id}`, productData, {
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
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data; // Retorna a mensagem de sucesso do backend
    } catch (error) {
      console.error(`Erro ao deletar o produto ${id}:`, error);
      throw error;
    }
  },

  // Buscar os produtos mais vendidos
  async getBestSellingProducts() {
    try {
      const response = await axios.get(`${API_URL}/best-selling`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
      throw error;
    }
  },

  // Buscar os produtos mais recentes
  async getLatestProducts() {
    try {
      const response = await axios.get(`${API_URL}/latest`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos recentes:', error);
      throw error;
    }
  },
};