// 🎯 PERFORMANCE: SDK do Mercado Pago carregado apenas quando necessário
// Evita carregar 300KB+ de JS na home e outras páginas

import { ref } from 'vue';

const sdkLoaded = ref(false);
const sdkLoading = ref(false);

/**
 * Carrega o SDK do Mercado Pago dinamicamente
 * @returns {Promise<boolean>} true se carregado com sucesso
 */
export function useMercadoPago() {
  const loadMercadoPagoSDK = () => {
    return new Promise((resolve, reject) => {
      // Se já foi carregado, retorna imediatamente
      if (sdkLoaded.value) {
        console.log('💳 Mercado Pago SDK já carregado');
        resolve(true);
        return;
      }

      // Se está carregando, aguarda
      if (sdkLoading.value) {
        const checkInterval = setInterval(() => {
          if (sdkLoaded.value) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
        return;
      }

      console.log('💳 Carregando Mercado Pago SDK...');
      sdkLoading.value = true;

      // Cria o script tag dinamicamente
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Mercado Pago SDK carregado com sucesso');
        sdkLoaded.value = true;
        sdkLoading.value = false;
        resolve(true);
      };

      script.onerror = (error) => {
        console.error('❌ Erro ao carregar Mercado Pago SDK:', error);
        sdkLoading.value = false;
        reject(new Error('Falha ao carregar SDK do Mercado Pago'));
      };

      document.head.appendChild(script);
    });
  };

  return {
    loadMercadoPagoSDK,
    sdkLoaded,
    sdkLoading
  };
}
