// view/services/CouponService.js

import axios from './main'; // Usando a instância configurada do axios

const API_URL = '/api/coupons';

const getToken = () => localStorage.getItem('token');

export default {
  // Obter todos os cupons
  async getAllCoupons() {
    const token = getToken();
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Obter um cupom pelo ID
  async getCouponById(id) {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Criar novo cupom
  async createCoupon(couponData) {
    const token = getToken();
    const response = await axios.post(API_URL, couponData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Atualizar um cupom
  async updateCoupon(id, couponData) {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${id}`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Deletar um cupom
  async deleteCoupon(id) {
    const token = getToken();
    await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Validar cupom (para o carrinho)
  async validateCoupon(code) {
    const response = await axios.post(`${API_URL}/validate`, { code });
    return response.data;
  }
};