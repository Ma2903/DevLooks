// Teste direto do node-correios
import Correios from 'node-correios';

const correios = new Correios();

async function testarCorreios() {
    console.log('🧪 Testando API dos Correios diretamente...\n');

    const args = {
        sCepOrigem: '19200009',
        sCepDestino: '01310100',
        nVlPeso: '1',
        nCdFormato: '1',
        nVlComprimento: '20',
        nVlAltura: '10',
        nVlLargura: '15',
        nCdServico: ['04014'], // SEDEX
        nVlDiametro: '0',
    };

    console.log('📦 Argumentos:', JSON.stringify(args, null, 2));

    try {
        console.log('\n⏳ Chamando API dos Correios...\n');
        const result = await correios.calcPrecoPrazo(args);
        
        console.log('✅ SUCESSO! Resposta:');
        console.log(JSON.stringify(result, null, 2));
        
        if (result && result.length > 0) {
            const service = result[0];
            console.log('\n📊 Detalhes:');
            console.log(`   Código: ${service.Codigo}`);
            console.log(`   Valor: ${service.Valor}`);
            console.log(`   Prazo: ${service.PrazoEntrega} dias`);
            console.log(`   Erro: ${service.Erro}`);
            console.log(`   MsgErro: ${service.MsgErro}`);
        }
        
    } catch (error) {
        console.error('\n❌ ERRO:');
        console.error('Tipo:', error.constructor.name);
        console.error('Mensagem:', error.message);
        console.error('Stack:', error.stack);
    }
}

testarCorreios();
