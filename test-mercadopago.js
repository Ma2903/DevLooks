// Script para testar se o token do Mercado Pago está funcionando
import { MercadoPagoConfig, Preference } from 'mercadopago';

const ACCESS_TOKEN = "APP_USR-2527278991117877-102021-f0327e03ea48f78a1f760a5ad5276ac7-2937731178";

console.log('🔑 Testando token:', ACCESS_TOKEN.substring(0, 15) + '...');

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });

async function testToken() {
  try {
    const preference = new Preference(client);
    
    const testPreference = {
      items: [
        {
          id: 'test',
          title: 'Produto de Teste',
          quantity: 1,
          unit_price: 10,
          currency_id: 'BRL'
        }
      ],
      back_urls: {
        success: 'https://devlooks.vercel.app/order/success',
        failure: 'https://devlooks.vercel.app/order/failure',
        pending: 'https://devlooks.vercel.app/order/pending'
      },
      external_reference: 'TEST_' + Date.now(),
      statement_descriptor: 'DevLooks'
    };

    console.log('📦 Tentando criar preferência de teste...');
    const response = await preference.create({ body: testPreference });
    
    console.log('✅ SUCESSO! Token válido!');
    console.log('✅ Preference ID:', response.id);
    console.log('✅ Init Point:', response.init_point);
    
  } catch (error) {
    console.error('❌ ERRO! Token inválido ou sem permissões!');
    console.error('❌ Mensagem:', error.message);
    console.error('❌ Causa:', error.cause);
    console.error('❌ Stack:', error.stack);
  }
}

testToken();
