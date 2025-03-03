import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/', // Substitua pela URL do seu backend
});

export default instance;