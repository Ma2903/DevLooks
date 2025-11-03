// Teste do novo sistema de frete com fallback
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/shipping/calculate';

async function testarFreteNovo() {
    console.log('🧪 Testando novo sistema de frete com fallback...\n');

    // IMPORTANTE: Substitua pelo seu token JWT válido
    // Para pegar seu token: abra o DevTools (F12) → Application → Local Storage → token
    const TOKEN = localStorage.getItem('token') || 'SEU_TOKEN_AQUI';

    const testCases = [
        { name: 'São Paulo - Av. Paulista', cep: '01310-100' },
        { name: 'Rio de Janeiro - Centro', cep: '20040-020' },
        { name: 'Belo Horizonte', cep: '30140-071' },
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
            console.log(`   Simulado: ${response.data.simulated ? 'Sim' : 'Não'}`);
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

// Para rodar no navegador (Cole no Console do DevTools)
if (typeof window !== 'undefined') {
    window.testarFreteNovo = testarFreteNovo;
    console.log('✅ Função testarFreteNovo() disponível!');
    console.log('💡 Digite testarFreteNovo() para executar os testes');
}

// Para rodar no Node.js
if (typeof window === 'undefined') {
    testarFreteNovo();
}
