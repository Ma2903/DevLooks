// Arquivo: DevLooks-main/server/controllers/AvatarController.ts

import { Request, Response, RequestHandler } from 'express';
import axios from 'axios';

class AvatarController {
  /**
   * Atua como um proxy para buscar o avatar da API externa, evitando problemas de CORS.
   */
  static getAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    // A URL completa do avataaars.io será passada como um parâmetro de query
    const avatarUrl = req.query.url as string;

    if (!avatarUrl) {
      res.status(400).json({ error: 'URL do avatar não fornecida.' });
      return;
    }

    try {
      // O servidor faz a requisição para a API externa
      const response = await axios.get(avatarUrl, {
        responseType: 'arraybuffer' // Essencial para lidar com imagens
      });

      // Define o tipo de conteúdo da resposta como SVG
      res.setHeader('Content-Type', 'image/svg+xml');
      
      // Envia os dados da imagem de volta para o frontend
      res.send(response.data);

    } catch (error) {
      console.error('Erro ao buscar o avatar via proxy:', error);
      res.status(500).json({ error: 'Não foi possível carregar o avatar.' });
    }
  };
}

export default AvatarController;