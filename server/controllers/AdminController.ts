// server/controllers/AdminController.ts

import { Request, Response, RequestHandler } from 'express';
import UserModel from '../models/UserModel';
// Garantindo que os outros models que você usa continuem importados
import ProductModel from '../models/ProductModel';
import CouponModel from '../models/CouponModel';
import OrderModel from '../models/OrderModel';


// 1. Interface (Alvo) que nosso sistema espera.
interface IDataExporter {
  export(data: any[]): string;
  getContentType(): string;
  getFileExtension(): string;
}

// 2. Implementação Concreta para o formato nativo (JSON).
class JsonExporter implements IDataExporter {
  export(data: any[]): string {
    return JSON.stringify(data, null, 2);
  }
  getContentType(): string {
    return 'application/json';
  }
  getFileExtension(): string {
    return 'json';
  }
}

// 3. Classe "Externa" que queremos adaptar (simula uma biblioteca de CSV).
class CsvLibrary {
  convertToCsv(jsonData: any[]): string {
    if (!jsonData || jsonData.length === 0) {
      return "";
    }

    // Função para formatar valores corretamente para CSV
    const formatValue = (value: any): string => {
        if (value === null || value === undefined) {
            return '';
        }
        if (value instanceof Date) {
            return value.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        }
        if (Array.isArray(value)) {
            return `"${value.map(item =>
                typeof item === 'object' ? JSON.stringify(item) : String(item)
            ).join('; ').replace(/"/g, '""')}"`;
        }
        if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        if (typeof value === 'string') {
            // Escapa aspas duplas e envolve em aspas se contiver vírgula, quebra de linha ou aspas
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }
        return String(value);
    };

    // Função auxiliar para achatar objetos
    const flattenObject = (data: any, prefix = ''): { [key: string]: any } => {
        const result: { [key: string]: any } = {};
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;

            const newKey = prefix ? `${prefix}_${key}` : key;
            const value = data[key];

            if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
                Object.assign(result, flattenObject(value, newKey));
            } else {
                result[newKey] = value;
            }
        }
        return result;
    };

    // 1. Achata todos os dados
    const flattenedData = jsonData.map(row => flattenObject(row));

    if (flattenedData.length === 0) {
        return "";
    }

    // 2. Coleta todos os cabeçalhos únicos
    const allHeaders = new Set<string>();
    flattenedData.forEach(row => {
        Object.keys(row).forEach(key => allHeaders.add(key));
    });
    const headers = Array.from(allHeaders);

    // 3. Formata os cabeçalhos (capitaliza e remove underscores)
    const formattedHeaders = headers.map(h =>
        h.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );

    // 4. Cria as linhas CSV com formatação adequada
    const csvRows = [
        formattedHeaders.join(','), // Cabeçalho formatado
        ...flattenedData.map(row =>
            headers.map(header => formatValue(row[header])).join(',')
        )
    ];

    // 5. Adiciona BOM para UTF-8 (suporte melhor no Excel)
    return '\uFEFF' + csvRows.join('\r\n');
  }
}

// 4. O Adapter que faz a ponte entre a nossa interface e a biblioteca externa.
class CsvAdapter implements IDataExporter {
  private csvLibrary: CsvLibrary;

  constructor() {
    this.csvLibrary = new CsvLibrary();
  }

  export(data: any[]): string {
    return this.csvLibrary.convertToCsv(data);
  }

  getContentType(): string {
    return 'text/csv';
  }

  getFileExtension(): string {
    return 'csv';
  }
}

class AdminController {
    // Seus métodos existentes (CRUD de usuário e extração de dados) permanecem intactos.
    static getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find().select('-password');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários', error });
        }
    };

    static getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById(req.params.id).select('-password');
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    };

    static updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
            if (!updatedUser) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar usuário', error });
        }
    };

    static deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuário', error });
        }
    };

    static exportData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { format = 'json', type } = req.query; // Recebe 'type' para decidir o que exportar
            let data;
            let fileName = `${type}`;

            // Um switch para buscar os dados corretos com base no tipo
            switch (type) {
                case 'products':
                    data = await ProductModel.find().lean();
                    fileName = 'relatorio_produtos';
                    break;
                case 'orders':
                    data = await OrderModel.find().populate('user', 'name email').lean();
                    fileName = 'relatorio_vendas';
                    break;
                case 'coupons':
                    data = await CouponModel.find().lean();
                    fileName = 'relatorio_cupons';
                    break;
                case 'users':
                default: // 'users' é o padrão
                    data = await UserModel.find().select('-password -cart -__v').lean();
                    fileName = 'relatorio_usuarios';
                    break;
            }

            if (!data) {
                res.status(404).json({ message: "Tipo de relatório não encontrado." });
                return;
            }

            let exporter: IDataExporter;
            // A lógica do Adapter decide o formato (JSON ou CSV)
            if (format === 'csv') {
                exporter = new CsvAdapter();
            } else {
                exporter = new JsonExporter();
            }

            const exportedData = exporter.export(data);
            const fullFileName = `${fileName}.${exporter.getFileExtension()}`;

            res.setHeader('Content-Type', exporter.getContentType());
            res.setHeader('Content-Disposition', `attachment; filename=${fullFileName}`);
            res.status(200).send(exportedData);

        } catch (error) {
            console.error("ERRO AO EXPORTAR DADOS:", error);
            res.status(500).json({ message: 'Erro ao exportar dados', error });
        }
    };
}

export default AdminController;