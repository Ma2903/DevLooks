import './assets/main.css'

import { createApp } from 'vue'
import router from './router'; // Importando o arquivo de rotas
import App from './App.vue'

const app = createApp(App);
app.use(router); // Adiciona o Vue Router à instância do aplicativo
app.mount('#app');
