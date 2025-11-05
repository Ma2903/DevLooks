// server/controllers/ShippingController.ts
import { Request, Response, RequestHandler } from "express";

/**
 * Tabela de Frete por Região (baseado nos 2 primeiros dígitos do CEP)
 * Valores aproximados para simular cálculo de frete
 */
const SHIPPING_TABLE: { [key: string]: { cost: number; days: string; region: string } } = {
    // São Paulo
    '01': { cost: 15.00, days: '3-5 dias úteis', region: 'São Paulo - Capital' },
    '02': { cost: 15.00, days: '3-5 dias úteis', region: 'São Paulo - Capital' },
    '03': { cost: 15.00, days: '3-5 dias úteis', region: 'São Paulo - Capital' },
    '04': { cost: 15.00, days: '3-5 dias úteis', region: 'São Paulo - Capital' },
    '05': { cost: 15.00, days: '3-5 dias úteis', region: 'São Paulo - Capital' },
    '06': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '07': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '08': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '09': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '10': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '11': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '12': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '13': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '14': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '15': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '16': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '17': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '18': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    '19': { cost: 20.00, days: '4-6 dias úteis', region: 'São Paulo - Interior' },
    
    // Rio de Janeiro e Espírito Santo
    '20': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '21': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '22': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '23': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '24': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '25': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '26': { cost: 25.00, days: '5-7 dias úteis', region: 'Rio de Janeiro' },
    '27': { cost: 30.00, days: '6-8 dias úteis', region: 'Espírito Santo' },
    '28': { cost: 30.00, days: '6-8 dias úteis', region: 'Espírito Santo' },
    '29': { cost: 30.00, days: '6-8 dias úteis', region: 'Espírito Santo' },
    
    // Minas Gerais
    '30': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '31': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '32': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '33': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '34': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '35': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '36': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '37': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '38': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    '39': { cost: 25.00, days: '5-7 dias úteis', region: 'Minas Gerais' },
    
    // Bahia e Sergipe
    '42': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '43': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '44': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '45': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '46': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '47': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '48': { cost: 35.00, days: '8-10 dias úteis', region: 'Bahia' },
    '49': { cost: 40.00, days: '9-12 dias úteis', region: 'Sergipe' },
    
    // Pernambuco e região
    '50': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '51': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '52': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '53': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '54': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '55': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '56': { cost: 40.00, days: '9-12 dias úteis', region: 'Pernambuco' },
    '57': { cost: 40.00, days: '9-12 dias úteis', region: 'Alagoas' },
    '58': { cost: 40.00, days: '9-12 dias úteis', region: 'Paraíba' },
    '59': { cost: 40.00, days: '9-12 dias úteis', region: 'Rio Grande do Norte' },
    
    // Ceará, Piauí, Maranhão
    '60': { cost: 40.00, days: '9-12 dias úteis', region: 'Ceará' },
    '61': { cost: 40.00, days: '9-12 dias úteis', region: 'Ceará' },
    '62': { cost: 40.00, days: '9-12 dias úteis', region: 'Ceará' },
    '63': { cost: 40.00, days: '9-12 dias úteis', region: 'Ceará' },
    '64': { cost: 45.00, days: '10-15 dias úteis', region: 'Piauí' },
    '65': { cost: 45.00, days: '10-15 dias úteis', region: 'Maranhão' },
    
    // Norte
    '66': { cost: 50.00, days: '12-18 dias úteis', region: 'Pará' },
    '67': { cost: 50.00, days: '12-18 dias úteis', region: 'Pará' },
    '68': { cost: 50.00, days: '12-18 dias úteis', region: 'Acre' },
    '69': { cost: 50.00, days: '12-18 dias úteis', region: 'Rondônia' },
    
    // Brasília e Centro-Oeste
    '70': { cost: 30.00, days: '6-8 dias úteis', region: 'Brasília - DF' },
    '71': { cost: 30.00, days: '6-8 dias úteis', region: 'Brasília - DF' },
    '72': { cost: 30.00, days: '6-8 dias úteis', region: 'Brasília - DF' },
    '73': { cost: 30.00, days: '6-8 dias úteis', region: 'Brasília - DF' },
    '74': { cost: 30.00, days: '6-8 dias úteis', region: 'Goiás' },
    '75': { cost: 30.00, days: '6-8 dias úteis', region: 'Goiás' },
    '77': { cost: 50.00, days: '12-18 dias úteis', region: 'Tocantins' },
    '78': { cost: 45.00, days: '10-15 dias úteis', region: 'Mato Grosso' },
    '79': { cost: 45.00, days: '10-15 dias úteis', region: 'Mato Grosso do Sul' },
    
    // Sul - Paraná
    '80': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '81': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '82': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '83': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '84': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '85': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '86': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    '87': { cost: 30.00, days: '6-8 dias úteis', region: 'Paraná' },
    
    // Santa Catarina
    '88': { cost: 35.00, days: '7-9 dias úteis', region: 'Santa Catarina' },
    '89': { cost: 35.00, days: '7-9 dias úteis', region: 'Santa Catarina' },
    
    // Rio Grande do Sul
    '90': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '91': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '92': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '93': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '94': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '95': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '96': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '97': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '98': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
    '99': { cost: 35.00, days: '7-9 dias úteis', region: 'Rio Grande do Sul' },
};

class ShippingController {
    static calculateShipping: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { cep, cepDestino } = req.body;
            const finalCepDestino = cep || cepDestino;

            if (!finalCepDestino) {
                res.status(400).json({ error: "CEP de destino não fornecido." });
                return;
            }

            // Remove formatação e valida CEP
            const cepClean = finalCepDestino.replace(/\D/g, '');
            
            if (cepClean.length !== 8) {
                res.status(400).json({ error: "CEP inválido. Digite um CEP com 8 dígitos." });
                return;
            }

            // Pega os 2 primeiros dígitos do CEP para identificar a região
            const cepPrefix = cepClean.substring(0, 2);
            
            // Busca na tabela de frete
            let shippingInfo = SHIPPING_TABLE[cepPrefix];
            
            if (!shippingInfo) {
                // CEP não encontrado na tabela - usa valor padrão
                console.log(`⚠️  CEP prefix ${cepPrefix} não encontrado. Usando valor padrão.`);
                shippingInfo = {
                    cost: 35.00,
                    days: '7-10 dias úteis',
                    region: 'Brasil'
                };
            }

            // Calcula ajuste baseado no peso e dimensões (agora obrigatórios no req.body)
            const { weight, dimensions } = req.body;
            let finalCost = shippingInfo.cost;
            const totalWeight = weight; // Peso total em kg (já calculado no frontend)
            
            if (!totalWeight || !dimensions) {
                res.status(400).json({ error: "Peso e dimensões do carrinho são obrigatórios para o cálculo do frete." });
                return;
            }

            // Fator de ajuste baseado no peso (ex: R$ 2,00 por kg adicional acima de 1kg)
            if (totalWeight > 1) {
                const extraWeight = totalWeight - 1;
                // Taxa de R$ 2,00 por kg adicional
                const weightSurcharge = extraWeight * 2.00; 
                finalCost += weightSurcharge;
                console.log(`📦 Peso adicional: ${extraWeight.toFixed(2)}kg - Taxa extra: R$ ${weightSurcharge.toFixed(2)}`);
            }

            // Fator de ajuste baseado no volume (ex: R$ 5,00 se o volume for muito grande)
            // Volume em cm³ / 1000 = dm³
            const volume = (dimensions.height * dimensions.width * dimensions.length) / 1000; 
            
            // Se o volume for maior que 30 dm³ (30 litros)
            if (volume > 30) {
                const volumeSurcharge = 5.00;
                finalCost += volumeSurcharge;
                console.log(`📏 Volume grande (${volume.toFixed(2)} dm³) - Taxa extra: R$ ${volumeSurcharge.toFixed(2)}`);
            }
            
            // Arredonda o custo final para 2 casas decimais
            finalCost = parseFloat(finalCost.toFixed(2));

            console.log(`✅ Frete calculado para ${shippingInfo.region}: R$ ${finalCost.toFixed(2)} - ${shippingInfo.days}`);

            res.status(200).json({
                service: 'SEDEX',
                cost: finalCost,
                deliveryTime: shippingInfo.days,
                region: shippingInfo.region
            });

        } catch (error: any) {
            console.error("❌ Erro ao calcular frete:", error.message);
            res.status(500).json({ 
                error: "Erro ao calcular o frete. Tente novamente." 
            });
        }
    };
}

export default ShippingController;