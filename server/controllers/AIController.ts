import { Request, Response, RequestHandler } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/config';

class AIController {
    private static genAI: GoogleGenerativeAI;
    
    static initialize() {
        if (!GEMINI_API_KEY) {
            console.warn('⚠️  GEMINI_API_KEY não configurada. Funcionalidades de IA desabilitadas.');
            return;
        }
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    }

    static analyzeSentiment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { comment } = req.body;

            if (!comment || comment.trim() === '') {
                res.status(400).json({ message: 'Comentário é obrigatório' });
                return;
            }

            if (!AIController.genAI) {
                res.status(503).json({ 
                    message: 'Serviço de IA não disponível',
                    sentiment: 'NEUTRO'
                });
                return;
            }

            const model = AIController.genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `Analise o sentimento do seguinte comentário de cliente sobre um produto de tecnologia/desenvolvedor (como camisetas, canecas, mousepads, teclados, periféricos) e classifique como POSITIVO, NEGATIVO ou NEUTRO. Responda APENAS com uma dessas três palavras:

Comentário: "${comment}"

Classificação:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const sentiment = response.text().trim().toUpperCase();

            // Validação da resposta
            const validSentiments = ['POSITIVO', 'NEGATIVO', 'NEUTRO'];
            const finalSentiment = validSentiments.includes(sentiment) ? sentiment : 'NEUTRO';

            res.status(200).json({ 
                sentiment: finalSentiment,
                comment: comment 
            });

        } catch (error: any) {
            console.error('Erro ao analisar sentimento:', error);
            res.status(500).json({ 
                message: 'Erro ao analisar sentimento',
                sentiment: 'NEUTRO',
                error: error.message 
            });
        }
    };

    static summarizeReviews: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { comments } = req.body;

            if (!comments || !Array.isArray(comments) || comments.length === 0) {
                res.status(400).json({ message: 'Lista de comentários é obrigatória' });
                return;
            }

            if (!AIController.genAI) {
                res.status(503).json({ 
                    message: 'Serviço de IA não disponível',
                    summary: 'Resumo não disponível no momento.'
                });
                return;
            }

            const model = AIController.genAI.getGenerativeModel({ model: 'gemini-pro' });

            const commentsList = comments.map((c, i) => `${i + 1}. "${c}"`).join('\n');

            const prompt = `Você é um assistente especializado em produtos para desenvolvedores e tecnologia. Analise os seguintes comentários de clientes sobre produtos como camisetas geek, canecas, mousepads, teclados mecânicos, periféricos e acessórios para programadores.

Crie um resumo conciso em português brasileiro, destacando:
- Qualidade do produto (material, impressão, acabamento)
- Conforto e usabilidade
- Design e estética
- Relação custo-benefício
- Pontos positivos mais mencionados
- Pontos de melhoria (se houver)

O resumo deve ter no máximo 3 parágrafos curtos e objetivos.

Comentários dos clientes:
${commentsList}

Resumo:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text().trim();

            res.status(200).json({ 
                summary: summary,
                totalComments: comments.length 
            });

        } catch (error: any) {
            console.error('Erro ao resumir comentários:', error);
            res.status(500).json({ 
                message: 'Erro ao resumir comentários',
                summary: 'Não foi possível gerar o resumo no momento.',
                error: error.message 
            });
        }
    };

    static getSentimentStats: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { comments } = req.body;

            if (!comments || !Array.isArray(comments) || comments.length === 0) {
                res.status(400).json({ message: 'Lista de comentários é obrigatória' });
                return;
            }

            if (!AIController.genAI) {
                res.status(503).json({ 
                    message: 'Serviço de IA não disponível'
                });
                return;
            }

            const model = AIController.genAI.getGenerativeModel({ model: 'gemini-pro' });

            // Analisa todos os comentários em lote
            const sentimentPromises = comments.map(async (comment) => {
                const prompt = `Classifique o sentimento deste comentário de um cliente sobre produto de tecnologia/desenvolvedor (camisetas, canecas, periféricos, acessórios geek) como POSITIVO, NEGATIVO ou NEUTRO. Responda APENAS com uma palavra:

"${comment}"`;

                try {
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const sentiment = response.text().trim().toUpperCase();
                    return ['POSITIVO', 'NEGATIVO', 'NEUTRO'].includes(sentiment) ? sentiment : 'NEUTRO';
                } catch {
                    return 'NEUTRO';
                }
            });

            const sentiments = await Promise.all(sentimentPromises);

            // Calcula estatísticas
            const stats = {
                total: sentiments.length,
                positivo: sentiments.filter((s: string) => s === 'POSITIVO').length,
                negativo: sentiments.filter((s: string) => s === 'NEGATIVO').length,
                neutro: sentiments.filter((s: string) => s === 'NEUTRO').length,
                percentages: {
                    positivo: 0,
                    negativo: 0,
                    neutro: 0
                }
            };

            stats.percentages.positivo = Math.round((stats.positivo / stats.total) * 100);
            stats.percentages.negativo = Math.round((stats.negativo / stats.total) * 100);
            stats.percentages.neutro = Math.round((stats.neutro / stats.total) * 100);

            res.status(200).json(stats);

        } catch (error: any) {
            console.error('Erro ao calcular estatísticas de sentimento:', error);
            res.status(500).json({ 
                message: 'Erro ao calcular estatísticas',
                error: error.message 
            });
        }
    };
}

// Inicializa o controller
AIController.initialize();

export default AIController;
