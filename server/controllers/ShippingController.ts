// server/controllers/ShippingController.ts
import { Request, Response, RequestHandler } from "express";
import Correios from "node-correios";

const correios = new Correios();

class ShippingController {
    static calculateShipping: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        // CORREÇÃO: Aceita 'cep' ou 'cepDestino' do corpo da requisição
        const { cep, cepDestino } = req.body;
        const finalCepDestino = cep || cepDestino;
        const cepOrigem = process.env.CORREIOS_CEP_ORIGEM;

        if (!finalCepDestino || !cepOrigem) {
            res.status(400).json({ error: "CEP de origem ou destino não fornecido." });
            return;
        }

        const args = {
            sCepOrigem: cepOrigem.replace(/\D/g, ''),
            sCepDestino: finalCepDestino.replace(/\D/g, ''),
            nVlPeso: '1',
            nCdFormato: '1',
            nVlComprimento: '20',
            nVlAltura: '10',
            nVlLargura: '15',
            nCdServico: ['04014'], // SEDEX
            nVlDiametro: '0',
        };

        try {
            const result = await correios.calcPrecoPrazo(args);
            
            if (!result || result.length === 0 || !result[0].Valor || result[0].Erro !== '') {
                 throw new Error(result[0].MsgErro || "Não foi possível calcular o frete para o CEP informado.");
            }

            res.status(200).json({
                service: 'SEDEX',
                cost: parseFloat(result[0].Valor.replace(',', '.')),
                deliveryTime: `${result[0].PrazoEntrega} dias úteis`
            });

        } catch (error) {
            console.error("Erro ao calcular frete com Correios:", error);
            res.status(500).json({ error: error.message || "Erro ao calcular o frete." });
        }
    };
}

export default ShippingController;