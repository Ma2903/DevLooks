import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost/api', // Substitua pela URL do seu backend
});

export default instance;