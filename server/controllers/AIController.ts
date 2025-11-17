import { Request, Response, RequestHandler } from 'express';
import { GEMINI_API_KEY } from '../config/config';

class AIController {
    private static apiKey: string;
    private static model: string = 'gemini-2.0-flash';
    
    static initialize() {
        if (!GEMINI_API_KEY) {
            console.error('❌ ERRO: GEMINI_API_KEY não configurada no arquivo .env');
            console.error('   As funcionalidades de IA NÃO funcionarão!');
            return;
        }
        
        this.apiKey = GEMINI_API_KEY;
        console.log('✅ GEMINI_API_KEY detectada:', GEMINI_API_KEY.substring(0, 10) + '...');
        console.log('✅ Gemini AI configurado com sucesso! Modelo:', this.model);
    }

    // Função auxiliar para chamar a API do Gemini usando fetch
    private static async callGeminiAPI(prompt: string, temperature: number = 0.7, maxTokens: number = 2048): Promise<string> {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{ 
                role: 'user', 
                parts: [{ text: prompt }] 
            }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: maxTokens,
                topP: 0.8,
                topK: 40
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok || !data.candidates) {
            throw new Error(data.error?.message || 'Erro ao receber resposta da API Gemini.');
        }

        return data.candidates[0].content.parts[0].text;
    }

    static analyzeSentiment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { comment } = req.body;

            if (!comment || comment.trim() === '') {
                res.status(400).json({ message: 'Comentário é obrigatório' });
                return;
            }

            if (!AIController.apiKey) {
                res.status(503).json({ 
                    message: 'Serviço de IA não disponível',
                    sentiment: 'NEUTRO'
                });
                return;
            }

            const prompt = `Analise o sentimento deste comentário de produto e classifique como POSITIVO, NEGATIVO ou NEUTRO.

Comentário: "${comment}"

Responda apenas: POSITIVO, NEGATIVO ou NEUTRO`;

            const response = await AIController.callGeminiAPI(prompt, 0.3, 10);
            const sentiment = response.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÇ]/g, '');

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

            console.log('\n🔍 === RESUMO DE AVALIAÇÕES ===');
            console.log('Comentários recebidos:', comments);

            if (!comments || !Array.isArray(comments) || comments.length === 0) {
                console.log('❌ Nenhum comentário válido recebido');
                res.status(400).json({ message: 'Lista de comentários é obrigatória' });
                return;
            }

            if (!AIController.apiKey) {
                console.error('❌ API Key do Gemini não configurada!');
                res.status(503).json({ 
                    message: 'Serviço de IA não disponível',
                    summary: 'Resumo não disponível no momento.'
                });
                return;
            }

            console.log('✅ API Key configurada, gerando resumo...');

            const commentsList = comments.map((c, i) => `${i + 1}. "${c}"`).join('\n');

            const prompt = `Você é um analisador de avaliações de produtos de e-commerce. Sua tarefa é criar um resumo profissional baseado nos comentários dos clientes.

INSTRUÇÕES:
1. Identifique os principais pontos positivos mencionados
2. Identifique os principais pontos negativos ou críticas
3. Escreva um resumo objetivo e imparcial em 2-3 frases
4. Use palavras como "Os clientes destacam...", "Alguns usuários mencionam...", "A maioria elogia..."
5. NÃO apenas repita o comentário - faça uma ANÁLISE

COMENTÁRIOS DOS CLIENTES:
${commentsList}

Escreva um resumo profissional analisando esses comentários:`;

            console.log('🚀 Enviando requisição para Gemini API...');
            
            const summary = await AIController.callGeminiAPI(prompt, 0.7, 250);

            console.log('🤖 Resumo gerado pela IA:');
            console.log(summary);
            console.log('=== FIM DO RESUMO ===\n');

            res.status(200).json({ 
                summary: summary.trim(),
                totalComments: comments.length 
            });

        } catch (error: any) {
            console.error('❌ ERRO ao resumir comentários:');
            console.error('Tipo:', error.name);
            console.error('Mensagem:', error.message);
            
            res.status(500).json({ 
                message: 'Erro ao resumir comentários',
                summary: 'Não foi possível gerar o resumo no momento.',
                error: error.message 
            });
        }
    };

    static getSentimentStats: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { comments, reviews } = req.body;

            // Suporta ambos os formatos: array de strings OU array de objetos {comment, rating}
            const reviewsData = reviews || comments?.map((c: string) => ({ comment: c, rating: 3 })) || [];

            if (!reviewsData || reviewsData.length === 0) {
                res.status(400).json({ message: 'Lista de comentários é obrigatória' });
                return;
            }

            if (!AIController.apiKey) {
                res.status(503).json({ 
                    message: 'Serviço de IA não disponível'
                });
                return;
            }

            console.log(`📊 Analisando sentimento de ${reviewsData.length} comentários com IA + Estrelas:`);
            reviewsData.forEach((r: any, i: number) => 
                console.log(`  ${i + 1}. [${r.rating}⭐] "${r.comment}"`)
            );

            // Analisa todos os comentários considerando texto + estrelas
            const sentimentPromises = reviewsData.map(async (review: any, index: number) => {
                const { comment, rating } = review;
                
                // SEMPRE analisa o texto primeiro
                let textSentiment = 'NEUTRO';
                
                try {
                    const prompt = `Analise APENAS o texto do comentário e classifique o sentimento como POSITIVO, NEGATIVO ou NEUTRO.

Comentário: "${comment}"

Responda APENAS uma palavra: POSITIVO, NEGATIVO ou NEUTRO`;
                    
                    const response = await AIController.callGeminiAPI(prompt, 0.3, 20);
                    const aiResponse = response.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÇ]/g, '');
                    
                    if (['POSITIVO', 'NEGATIVO', 'NEUTRO'].includes(aiResponse)) {
                        textSentiment = aiResponse;
                    }
                } catch (error) {
                    console.error(`⚠️ Erro ao analisar comentário ${index + 1}:`, error);
                }
                
                // Combina análise do texto com as estrelas
                let finalSentiment = textSentiment;
                
                // Se o texto é NEGATIVO, sempre prevalece (independente das estrelas)
                if (textSentiment === 'NEGATIVO') {
                    finalSentiment = 'NEGATIVO';
                    console.log(`  ➜ [${rating}⭐] Comentário ${index + 1}: ${finalSentiment} (texto negativo prevalece)`);
                }
                // Se o texto é POSITIVO, prevalece (independente das estrelas)
                else if (textSentiment === 'POSITIVO') {
                    finalSentiment = 'POSITIVO';
                    console.log(`  ➜ [${rating}⭐] Comentário ${index + 1}: ${finalSentiment} (texto positivo prevalece)`);
                }
                // Se o texto é NEUTRO, usa as estrelas como desempate
                else {
                    if (rating >= 4) {
                        finalSentiment = 'POSITIVO';
                        console.log(`  ➜ [${rating}⭐] Comentário ${index + 1}: ${finalSentiment} (estrelas altas + texto neutro)`);
                    } else if (rating <= 2) {
                        finalSentiment = 'NEGATIVO';
                        console.log(`  ➜ [${rating}⭐] Comentário ${index + 1}: ${finalSentiment} (estrelas baixas + texto neutro)`);
                    } else {
                        finalSentiment = 'NEUTRO';
                        console.log(`  ➜ [${rating}⭐] Comentário ${index + 1}: ${finalSentiment} (texto e estrelas neutros)`);
                    }
                }
                
                return finalSentiment;
            });

            const sentiments = await Promise.all(sentimentPromises);

            // Calcula estatísticas
            const stats = {
                total: sentiments.length,
                positivo: sentiments.filter(s => s === 'POSITIVO').length,
                negativo: sentiments.filter(s => s === 'NEGATIVO').length,
                neutro: sentiments.filter(s => s === 'NEUTRO').length,
                percentages: {
                    positivo: 0,
                    negativo: 0,
                    neutro: 0
                }
            };

            stats.percentages.positivo = Math.round((stats.positivo / stats.total) * 100);
            stats.percentages.negativo = Math.round((stats.negativo / stats.total) * 100);
            stats.percentages.neutro = Math.round((stats.neutro / stats.total) * 100);

            console.log(`\n📊 ESTATÍSTICAS FINAIS:`);
            console.log(`   ✅ Positivo: ${stats.positivo} (${stats.percentages.positivo}%)`);
            console.log(`   ❌ Negativo: ${stats.negativo} (${stats.percentages.negativo}%)`);
            console.log(`   ⚪ Neutro: ${stats.neutro} (${stats.percentages.neutro}%)\n`);

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
