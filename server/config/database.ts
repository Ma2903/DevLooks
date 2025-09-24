// server/config/database.ts
import mongoose from "mongoose";

class Database {
    // Armazena a única instância da classe
    private static instance: Database;

    // O construtor é privado para impedir a criação de instâncias com 'new'
    private constructor() {
        this.connect();
    }

    // Método estático que controla o acesso à instância
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    // Método privado para realizar a conexão
    private async connect() {
        const dbUri = process.env.MONGO_URI;

        if (!dbUri) {
            console.error("❌ ERRO: A variável MONGO_URI não foi definida no seu arquivo .env");
            process.exit(1);
        }

        try {
            await mongoose.connect(dbUri);
            console.log("✅ Conectado ao MongoDB!");
        } catch (error) {
            console.error("❌ Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
}

// Exportamos a instância única para ser usada em outros lugares do projeto
export default Database.getInstance();