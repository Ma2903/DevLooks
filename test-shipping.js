/**
 * Script de teste para o cálculo de frete
 * Execute com: node test-shipping.js (ou npx tsx test-shipping.ts)
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/shipping/calculate';

async function testShipping() {
    console.log('🧪 Testando cálculo de frete...\n');

    // Você precisa estar logado para usar essa rota
    // Substitua o TOKEN abaixo pelo seu token JWT válido
    const TOKEN = 'SEU_TOKEN_AQUI';

    const testCases = [
        { name: 'CEP com hífen', cep: '01310-100' },
        { name: 'CEP sem hífen', cep: '01310100' },
        { name: 'CEP de São Paulo', cep: '04038-034' },
    ];

    for (const testCase of testCases) {
        console.log(`\n📦 Teste: ${testCase.name}`);
        console.log(`   CEP: ${testCase.cep}`);

        try {
            const response = await axios.post(
                API_URL,
                { cep: testCase.cep },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${TOKEN}`
                    }
                }
            );

            console.log(`   ✅ Sucesso!`);
            console.log(`   Serviço: ${response.data.service}`);
            console.log(`   Custo: R$ ${response.data.cost.toFixed(2)}`);
            console.log(`   Prazo: ${response.data.deliveryTime}`);
        } catch (error) {
            if (error.response) {
                console.log(`   ❌ Erro: ${error.response.data.error}`);
                console.log(`   Status: ${error.response.status}`);
            } else {
                console.log(`   ❌ Erro de conexão: ${error.message}`);
            }
        }
    }

    console.log('\n✨ Teste concluído!\n');
}

testShipping();
