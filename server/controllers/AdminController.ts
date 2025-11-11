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

    // Função para limpar e preparar dados antes do processamento
    const cleanData = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;

        // Se for ObjectId do MongoDB, converte para string
        if (obj._id && typeof obj._id === 'object' && obj._id.toString) {
            obj._id = obj._id.toString();
        }

        // Se for array, limpa cada item
        if (Array.isArray(obj)) {
            return obj.map(item => cleanData(item));
        }

        // Se for objeto, limpa cada propriedade
        if (typeof obj === 'object' && !(obj instanceof Date)) {
            const cleaned: any = {};
            for (const key in obj) {
                if (!obj.hasOwnProperty(key)) continue;

                // Ignora campos internos do MongoDB
                if (key === '__v') continue;

                const value = obj[key];

                // Converte ObjectId para string
                if (value && typeof value === 'object' && value.toString && value.constructor.name === 'ObjectId') {
                    cleaned[key] = value.toString();
                }
                // Processa objetos aninhados
                else if (value && typeof value === 'object' && !(value instanceof Date)) {
                    // Se for um objeto com _id, converte o _id
                    if (value._id && typeof value._id === 'object') {
                        cleaned[key] = { ...value, _id: value._id.toString() };
                    } else {
                        cleaned[key] = cleanData(value);
                    }
                }
                else {
                    cleaned[key] = value;
                }
            }
            return cleaned;
        }

        return obj;
    };

    // Limpa todos os dados primeiro
    const cleanedData = jsonData.map(item => cleanData(item));

    // Função para formatar valores corretamente para CSV
    const formatValue = (value: any, forDisplay: boolean = false): string => {
        if (value === null || value === undefined) {
            return forDisplay ? '-' : '';
        }
        if (value instanceof Date) {
            const date = value.toISOString().split('T')[0];
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`; // Formato brasileiro: DD/MM/YYYY
        }
        if (Array.isArray(value)) {
            if (value.length === 0) return forDisplay ? '-' : '';
            const formatted = value.map(item =>
                typeof item === 'object' ? JSON.stringify(item) : String(item)
            ).join('; ');
            return `"${formatted.replace(/"/g, '""')}"`;
        }
        if (typeof value === 'object') {
            return `"${JSON.stringify(value, null, 0).replace(/"/g, '""')}"`;
        }
        if (typeof value === 'boolean') {
            return value ? 'Sim' : 'Não';
        }
        if (typeof value === 'number') {
            // Formata números com 2 casas decimais se for decimal
            return Number.isInteger(value) ? String(value) : value.toFixed(2);
        }
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (trimmed === '') return forDisplay ? '-' : '';
            // Escapa aspas duplas e envolve em aspas se contiver vírgula, quebra de linha ou aspas
            if (trimmed.includes(',') || trimmed.includes('\n') || trimmed.includes('"') || trimmed.includes(';')) {
                return `"${trimmed.replace(/"/g, '""')}"`;
            }
            return trimmed;
        }
        return String(value);
    };

    // Função auxiliar para achatar objetos (simplificada)
    const flattenObject = (data: any, prefix = ''): { [key: string]: any } => {
        const result: { [key: string]: any } = {};
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;

            // Ignora campos internos
            if (key === '__v') continue;

            const newKey = prefix ? `${prefix}_${key}` : key;
            const value = data[key];

            // Não achata objetos que são _id ou que contém apenas campos simples
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
                // Se o objeto tem _id, apenas extrai campos importantes
                if (value._id) {
                    result[newKey] = value.name || value.email || value.title || value._id;
                } else {
                    Object.assign(result, flattenObject(value, newKey));
                }
            } else {
                result[newKey] = value;
            }
        }
        return result;
    };

    // 1. Achata todos os dados limpos
    const flattenedData = cleanedData.map(row => flattenObject(row));

    if (flattenedData.length === 0) {
        return "";
    }

    // 2. Coleta todos os cabeçalhos únicos e filtra indesejados
    const allHeaders = new Set<string>();
    flattenedData.forEach(row => {
        Object.keys(row).forEach(key => {
            // Ignora campos que contêm "buffer", "_id_" múltiplos, ou campos internos
            const keyLower = key.toLowerCase();
            if (!keyLower.includes('buffer') &&
                !keyLower.includes('_bsontype') &&
                !keyLower.includes('_id_id') &&
                !keyLower.includes('_id_bsontype') &&
                key !== '__v') {
                allHeaders.add(key);
            }
        });
    });

    // Ordena para campos importantes virem primeiro
    const headers = Array.from(allHeaders).sort((a, b) => {
        const priority: { [key: string]: number } = {
            '_id': 1,
            'name': 2,
            'email': 3,
            'title': 4,
            'price': 5,
            'status': 6,
            'total': 7,
            'createdAt': 98,
            'updatedAt': 99,
            '__v': 100
        };

        const priorityA = priority[a] || 50;
        const priorityB = priority[b] || 50;

        if (priorityA !== priorityB) return priorityA - priorityB;
        return a.localeCompare(b);
    });

    // 3. Formata os cabeçalhos (capitaliza e remove underscores)
    const formattedHeaders = headers.map(h => {
        // Remove underscores no início
        const cleaned = h.replace(/^_+/, '');

        // Mapeamento de nomes específicos
        const nameMap: { [key: string]: string } = {
            '_id': 'ID',
            'id': 'ID',
            'createdAt': 'Data Criação',
            'updatedAt': 'Data Atualização',
            'email': 'E-mail',
            'name': 'Nome',
            'price': 'Preço',
            'total': 'Total',
            'status': 'Status',
            'quantity': 'Quantidade',
            'description': 'Descrição',
            'category': 'Categoria',
            'stock': 'Estoque',
            'isActive': 'Ativo',
            'isAdmin': 'Admin',
            'phone': 'Telefone',
            'address': 'Endereço',
            'user': 'Usuário',
            'product': 'Produto',
            'items': 'Itens',
            '__v': 'Versão'
        };

        if (nameMap[h]) return nameMap[h];

        // Formatação padrão
        return cleaned
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });

    // 4. Cria as linhas CSV com separador de ponto e vírgula (melhor para Excel brasileiro)
    const separator = ';';
    const csvRows = [
        formattedHeaders.join(separator), // Cabeçalho formatado
        ...flattenedData.map(row =>
            headers.map(header => formatValue(row[header], true)).join(separator)
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