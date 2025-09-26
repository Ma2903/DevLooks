import axios from "axios";

const API_URL = '/api/products';

export default {
  // Buscar todos os produtos
  async getAllProducts() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // Buscar um produto pelo ID
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  },

  // Criar um novo produto
  async createProduct(product) {
    try {
      const response = await axios.post(API_URL, product);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar um produto existente
  async updateProduct(id, product) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // Deletar um produto
  async deleteProduct(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },

  async getBestSellingProducts() {
    try {
      const response = await axios.get(`${API_URL}/best-selling`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
      throw error;
    }
  },

  // --- NOVO MÉTODO ADICIONADO AQUI ---
  async getLatestProducts() {
    try {
      const response = await axios.get(`${API_URL}/latest`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos recentes:', error);
      throw error;
    }
  },

  async updateProduto(produto) {
    return axios.put(`http://localhost:3000/api/products/${produto._id}`, produto);
  }
};
